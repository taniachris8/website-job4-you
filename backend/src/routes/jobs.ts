import { Router } from "express";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { validate } from "../lib/validate";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const createJobSchema = z.object({
  id: z.string().min(1).optional(),
  jobTitle: z.string().min(1),
  area: z.string().min(1),
  domain: z.string().min(1),
  profession: z.string().min(1),
  scope: z.string().min(1),
  jobNumber: z.string().min(1),
  jobDescription: z.string().min(1),
  jobRequirements: z.string().min(1)
});

const updateJobSchema = z
  .object({
    jobTitle: z.string().min(1).optional(),
    area: z.string().min(1).optional(),
    domain: z.string().min(1).optional(),
    profession: z.string().min(1).optional(),
    scope: z.string().min(1).optional(),
    jobNumber: z.string().min(1).optional(),
    jobDescription: z.string().min(1).optional(),
    jobRequirements: z.string().min(1).optional()
  })
  .strict();

const querySchema = z.object({
  area: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  profession: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
  offset: z.coerce.number().int().min(0).optional()
});

const generateShortId = () => randomBytes(2).toString("hex");

const generateUniqueJobId = async () => {
  for (let i = 0; i < 10; i += 1) {
    const id = generateShortId();
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return id;
  }
  throw new AppError(500, "INTERNAL", "Failed to generate unique job id");
};

router.get("/", async (req, res, next) => {
  try {
    const query = validate(querySchema, req.query);

    const where = {
      ...(query.area ? { area: { contains: query.area, mode: "insensitive" as const } } : {}),
      ...(query.domain
        ? { domain: { contains: query.domain, mode: "insensitive" as const } }
        : {}),
      ...(query.profession
        ? { profession: { contains: query.profession, mode: "insensitive" as const } }
        : {}),
      ...(query.scope ? { scope: { contains: query.scope, mode: "insensitive" as const } } : {}),
      ...(query.jobTitle
        ? { jobTitle: { contains: query.jobTitle, mode: "insensitive" as const } }
        : {})
    };

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: query.offset,
      take: query.limit
    });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) {
      throw new AppError(404, "NOT_FOUND", "Job not found");
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const payload = validate(createJobSchema, req.body);
    const jobId = payload.id ?? (await generateUniqueJobId());

    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (existing) {
      throw new AppError(409, "CONFLICT", "Job id already exists");
    }

    const job = await prisma.job.create({
      data: {
        id: jobId,
        jobTitle: payload.jobTitle,
        area: payload.area,
        domain: payload.domain,
        profession: payload.profession,
        scope: payload.scope,
        jobNumber: payload.jobNumber,
        jobDescription: payload.jobDescription,
        jobRequirements: payload.jobRequirements
      }
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const payload = validate(updateJobSchema, req.body);
    if (Object.keys(payload).length === 0) {
      throw new AppError(400, "BAD_REQUEST", "No fields to update");
    }

    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "Job not found");
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: payload
    });

    res.json(job);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const existing = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "Job not found");
    }

    await prisma.job.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
