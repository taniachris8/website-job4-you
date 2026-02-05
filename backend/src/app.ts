import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import jobsRouter from "./routes/jobs";
import { AppError, errorHandler } from "./lib/errors";

dotenv.config();

const app = express();

const rawOrigins =
  process.env.FRONTEND_ORIGIN ||
  process.env.CORS_ORIGINS ||
  "http://localhost:5173";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/auth", authRouter);

app.use((_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Route not found"));
});

app.use(errorHandler);

export default app;
