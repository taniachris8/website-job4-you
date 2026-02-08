import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../lib/errors";

export type AuthUser = {
  userId: string;
  role: "ADMIN" | "USER";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const getAccessSecret = () =>
  process.env.JWT_ACCESS_SECRET || "dev-access-secret";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHORIZED", "Missing access token");
    }
    const token = header.replace("Bearer ", "").trim();
    const payload = jwt.verify(token, getAccessSecret()) as {
      sub: string;
      role: "ADMIN" | "USER";
    };

    req.user = { userId: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new AppError(401, "UNAUTHORIZED", "Invalid or expired access token"));
  }
};

export const requireRole = (role: "ADMIN" | "USER") =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "UNAUTHORIZED", "Missing access token"));
    }
    if (req.user.role !== role) {
      return next(new AppError(403, "FORBIDDEN", "Forbidden"));
    }
    return next();
  };
