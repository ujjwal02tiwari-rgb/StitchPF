// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Reuse a single client in dev to avoid "too many connections" on HMR
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // optional
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

