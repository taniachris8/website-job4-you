import dotenv from "dotenv";
import app from "./app";
import { prisma } from "./lib/prisma";

dotenv.config();

const port = Number(process.env.PORT) || 8080;

const connectWithRetry = async () => {
  const maxAttempts = 10;
  const baseDelayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();
      console.log("Connected to database");
      return;
    } catch (err) {
      console.error(`Database connection failed (attempt ${attempt}/${maxAttempts})`);
      if (attempt === maxAttempts) throw err;
      const delay = baseDelayMs * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const start = async () => {
  await connectWithRetry();
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
