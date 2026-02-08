import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import seedData from "./seed-data.json";

const prisma = new PrismaClient();

type SeedUser = {
  id: string;
  name: string;
  familyName: string;
  email: string;
  password: string;
  role?: string;
  savedJobs?: string[];
};

type SeedJob = {
  id: string;
  jobTitle: string;
  area: string;
  domain: string;
  profession: string;
  scope: string;
  jobNumber: string;
  jobDescription: string;
  jobRequirements: string;
};

const normalizeRole = (role?: string): Role => {
  if (!role) return Role.USER;
  return role.toLowerCase() === "admin" ? Role.ADMIN : Role.USER;
};

const hashIfNeeded = async (password: string) => {
  if (password.length >= 30) return password;
  return bcrypt.hash(password, 10);
};

async function main() {
  const jobs = seedData.jobs as SeedJob[];
  const users = seedData.users as SeedUser[];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        jobTitle: job.jobTitle,
        area: job.area,
        domain: job.domain,
        profession: job.profession,
        scope: job.scope,
        jobNumber: job.jobNumber,
        jobDescription: job.jobDescription,
        jobRequirements: job.jobRequirements
      },
      create: {
        id: job.id,
        jobTitle: job.jobTitle,
        area: job.area,
        domain: job.domain,
        profession: job.profession,
        scope: job.scope,
        jobNumber: job.jobNumber,
        jobDescription: job.jobDescription,
        jobRequirements: job.jobRequirements
      }
    });
  }

  const existingJobIds = new Set(
    (await prisma.job.findMany({ select: { id: true } })).map((j) => j.id)
  );

  for (const user of users) {
    const password = await hashIfNeeded(user.password);
    const savedJobs = (user.savedJobs ?? []).filter((jobId) =>
      existingJobIds.has(jobId)
    );

    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        familyName: user.familyName,
        role: normalizeRole(user.role),
        password
      },
      create: {
        id: user.id,
        name: user.name,
        familyName: user.familyName,
        email: user.email,
        password,
        role: normalizeRole(user.role)
      }
    });

    await prisma.userSavedJob.deleteMany({ where: { userId: upserted.id } });

    if (savedJobs.length > 0) {
      await prisma.userSavedJob.createMany({
        data: savedJobs.map((jobId) => ({ userId: upserted.id, jobId })),
        skipDuplicates: true
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
