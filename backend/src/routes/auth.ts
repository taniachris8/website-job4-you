import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { createHash, randomBytes, randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { validate } from "../lib/validate";
import { requireAuth } from "../middleware/auth";
import { sendPasswordResetMail } from "../services/mailService";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  familyName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || "dev-access-secret";

const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

const getAccessTtl = () => process.env.ACCESS_TOKEN_TTL || "15m";

const getRefreshTtlDays = () => {
  const raw = process.env.REFRESH_TOKEN_TTL_DAYS || "30";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
};

const getPasswordResetTtlMinutes = () => {
  const raw = process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || "60";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
};

const getAppBaseUrl = () =>
  (process.env.APP_BASE_URL || process.env.FRONTEND_ORIGIN || "http://localhost:5173").replace(
    /\/+$/,
    ""
  );

const getCookieSecure = () => process.env.COOKIE_SECURE === "true";

const getCookieSameSite = (): "lax" | "strict" | "none" => {
  const value = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
  if (value === "strict" || value === "none" || value === "lax") return value;
  return "lax";
};

const hashPasswordIfNeeded = async (password: string) => {
  if (password.length >= 30) return password;
  return bcrypt.hash(password, 10);
};

const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const toUserResponse = (user: {
  id: string;
  name: string;
  familyName: string;
  email: string;
  role: string;
  savedJobs: { jobId: string }[];
}) => ({
  id: user.id,
  name: user.name,
  familyName: user.familyName,
  email: user.email,
  role: user.role === "ADMIN" ? "admin" : "user",
  savedJobs: user.savedJobs.map((item) => item.jobId)
});

const signAccessToken = (payload: { sub: string; role: "ADMIN" | "USER" }) => {
  const secret: Secret = getAccessSecret();
  const options: SignOptions = {
    expiresIn: getAccessTtl() as SignOptions["expiresIn"]
  };
  return jwt.sign(payload, secret, options);
};

const signRefreshToken = (payload: { sub: string; jti: string }) => {
  const expiresInDays = getRefreshTtlDays();
  const secret: Secret = getRefreshSecret();
  const options: SignOptions = {
    expiresIn: `${expiresInDays}d` as SignOptions["expiresIn"]
  };
  return jwt.sign(payload, secret, options);
};

const generateShortId = () => randomBytes(2).toString("hex");

const generateUniqueUserId = async () => {
  for (let i = 0; i < 10; i += 1) {
    const id = generateShortId();
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return id;
  }

  throw new AppError(500, "INTERNAL", "Failed to generate unique user id");
};

const setRefreshCookie = (res: any, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: getCookieSecure(),
    sameSite: getCookieSameSite(),
    maxAge: getRefreshTtlDays() * 24 * 60 * 60 * 1000
  };

  res.cookie("refreshToken", token, {
    ...cookieOptions,
    path: "/auth/refresh"
  });
  res.cookie("refreshToken", token, {
    ...cookieOptions,
    path: "/auth/logout"
  });
};

const clearRefreshCookie = (res: any) => {
  const cookieOptions = {
    httpOnly: true,
    secure: getCookieSecure(),
    sameSite: getCookieSameSite()
  };

  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: "/auth/refresh"
  });
  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: "/auth/logout"
  });
};

const createRefreshToken = async (userId: string) => {
  const refreshId = randomUUID();
  const token = signRefreshToken({ sub: userId, jti: refreshId });
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + getRefreshTtlDays() * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      id: refreshId,
      userId,
      tokenHash,
      expiresAt
    }
  });

  return token;
};

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many password reset requests. Try again later."
    }
  }
});

const issueAuthResponse = async (req: any, res: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { savedJobs: { select: { jobId: true } } }
  });

  if (!user) {
    throw new AppError(404, "NOT_FOUND", "User not found");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);
  setRefreshCookie(res, refreshToken);

  const responseBody: any = {
    user: toUserResponse(user),
    accessToken
  };

  if (req.query?.returnRefreshToken === "true") {
    responseBody.refreshToken = refreshToken;
  }

  return responseBody;
};

router.post("/register", async (req, res, next) => {
  try {
    const payload = validate(registerSchema, req.body);

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new AppError(409, "CONFLICT", "Email already exists");
    }

    const password = await hashPasswordIfNeeded(payload.password);

    const user = await prisma.user.create({
      data: {
        id: await generateUniqueUserId(),
        name: payload.name,
        familyName: payload.familyName,
        email: payload.email,
        password,
        role: "USER"
      }
    });

    const responseBody = await issueAuthResponse(req, res, user.id);
    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = validate(loginSchema, req.body);
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { savedJobs: { select: { jobId: true } } }
    });

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    let valid = false;
    if (user.password.length >= 30) {
      valid = await bcrypt.compare(payload.password, user.password);
    } else {
      valid = user.password === payload.password;
      if (valid) {
        const hashed = await bcrypt.hash(payload.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed }
        });
      }
    }

    if (!valid) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = await createRefreshToken(user.id);
    setRefreshCookie(res, refreshToken);

    const responseBody: any = {
      user: toUserResponse(user),
      accessToken
    };

    if (req.query.returnRefreshToken === "true") {
      responseBody.refreshToken = refreshToken;
    }

    res.json(responseBody);
  } catch (err) {
    next(err);
  }
});

router.post("/forgot-password", forgotPasswordLimiter, async (req, res, next) => {
  try {
    const payload = validate(forgotPasswordSchema, req.body);
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      res.status(204).send();
      return;
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + getPasswordResetTtlMinutes() * 60 * 1000);
    const resetUrl = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null
        },
        data: {
          usedAt: new Date()
        }
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt
        }
      })
    ]);

    await sendPasswordResetMail({
      to: user.email,
      resetUrl
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const payload = validate(resetPasswordSchema, req.body);
    const tokenHash = hashResetToken(payload.token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash }
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new AppError(400, "BAD_REQUEST", "Reset link is invalid or has expired");
    }

    const password = await hashPasswordIfNeeded(payload.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id }
        },
        data: { usedAt: new Date() }
      }),
      prisma.refreshToken.updateMany({
        where: {
          userId: resetToken.userId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      })
    ]);

    clearRefreshCookie(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new AppError(401, "UNAUTHORIZED", "Missing refresh token");
    }

    const payload = jwt.verify(token, getRefreshSecret()) as { sub: string; jti: string };
    const stored = await prisma.refreshToken.findUnique({
      where: { id: payload.jti }
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError(401, "UNAUTHORIZED", "Refresh token invalid");
    }

    const matches = await bcrypt.compare(token, stored.tokenHash);
    if (!matches) {
      throw new AppError(401, "UNAUTHORIZED", "Refresh token invalid");
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    const newRefreshToken = await createRefreshToken(payload.sub);
    setRefreshCookie(res, newRefreshToken);

    const refreshedUser = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!refreshedUser) {
      throw new AppError(404, "NOT_FOUND", "User not found");
    }

    const accessToken = signAccessToken({ sub: payload.sub, role: refreshedUser.role });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, getRefreshSecret()) as { jti: string };
        await prisma.refreshToken.update({
          where: { id: payload.jti },
          data: { revokedAt: new Date() }
        });
      } catch {
        // best effort
      }
    }

    clearRefreshCookie(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "Missing access token");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { savedJobs: { select: { jobId: true } } }
    });

    if (!user) {
      throw new AppError(404, "NOT_FOUND", "User not found");
    }

    res.json(toUserResponse(user));
  } catch (err) {
    next(err);
  }
});

export default router;
