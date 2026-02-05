import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { validate } from "../lib/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const roleSchema = z.enum(["admin", "user"]);

const createUserSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  familyName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: roleSchema.optional(),
  savedJobs: z.array(z.string().min(1)).optional()
});

const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    familyName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(1).optional(),
    role: roleSchema.optional(),
    savedJobs: z.array(z.string().min(1)).optional()
  })
  .strict();

const mapRole = (role?: string) => (role?.toLowerCase() === "admin" ? "ADMIN" : "USER");

const formatRole = (role: string) => (role === "ADMIN" ? "admin" : "user");

const generateShortId = () => randomBytes(2).toString("hex");

const generateUniqueUserId = async () => {
  for (let i = 0; i < 10; i += 1) {
    const id = generateShortId();
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return id;
  }
  throw new AppError(500, "INTERNAL", "Failed to generate unique user id");
};

const hashPasswordIfNeeded = async (password: string) => {
  if (password.length >= 30) return password;
  return bcrypt.hash(password, 10);
};

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
  role: formatRole(user.role),
  savedJobs: user.savedJobs.map((item) => item.jobId)
});

const createUser = async (payload: z.infer<typeof createUserSchema>) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new AppError(409, "CONFLICT", "Email already exists");
  }

  const userId = payload.id ?? (await generateUniqueUserId());
  const password = await hashPasswordIfNeeded(payload.password);

  const savedJobs = payload.savedJobs ?? [];
  const existingJobs = await prisma.job.findMany({
    where: { id: { in: savedJobs } },
    select: { id: true }
  });
  const validJobIds = new Set(
    existingJobs.map((job: { id: string }) => job.id)
  );

  const created = await prisma.user.create({
    data: {
      id: userId,
      name: payload.name,
      familyName: payload.familyName,
      email: payload.email,
      password,
      role: mapRole(payload.role),
      savedJobs: {
        create: savedJobs
          .filter((jobId) => validJobIds.has(jobId))
          .map((jobId) => ({ jobId }))
      }
    },
    include: { savedJobs: { select: { jobId: true } } }
  });

  return toUserResponse(created);
};

router.get("/", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { savedJobs: { select: { jobId: true } } },
      orderBy: { createdAt: "desc" }
    });

    res.json(users.map(toUserResponse));
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const payload = validate(createUserSchema, req.body);
    const user = await createUser(payload);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const payload = validate(createUserSchema, req.body);
    const user = await createUser(payload);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user?.role !== "ADMIN" && req.user?.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Forbidden");
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

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const payload = validate(updateUserSchema, req.body);
    if (Object.keys(payload).length === 0) {
      throw new AppError(400, "BAD_REQUEST", "No fields to update");
    }

    const userId = req.params.id;
    if (req.user?.role !== "ADMIN" && req.user?.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Forbidden");
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new AppError(404, "NOT_FOUND", "User not found");
    }

    if (payload.email && payload.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: payload.email } });
      if (emailExists) {
        throw new AppError(409, "CONFLICT", "Email already exists");
      }
    }

    const password = payload.password
      ? await hashPasswordIfNeeded(payload.password)
      : undefined;

    const updateData = {
      name: payload.name,
      familyName: payload.familyName,
      email: payload.email,
      password,
      role: payload.role ? mapRole(payload.role) : undefined
    };

    if (payload.savedJobs) {
      const existingJobs = await prisma.job.findMany({
        where: { id: { in: payload.savedJobs } },
        select: { id: true }
      });
      const validJobIds = existingJobs.map((job: { id: string }) => job.id);

      await prisma.$transaction([
        prisma.userSavedJob.deleteMany({ where: { userId } }),
        prisma.userSavedJob.createMany({
          data: validJobIds.map((jobId: string) => ({ userId, jobId })),
          skipDuplicates: true
        })
      ]);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { savedJobs: { select: { jobId: true } } }
    });

    res.json(toUserResponse(updated));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user?.role !== "ADMIN" && req.user?.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Forbidden");
    }
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "User not found");
    }

    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
