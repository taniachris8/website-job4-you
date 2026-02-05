import type { ZodSchema } from "zod";
import { AppError } from "./errors";

export const validate = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Validation failed", result.error.flatten());
  }
  return result.data;
};
