import { PrismaClient } from "@prisma/client";

declare global {
  // Using var is required for Next.js hot-reload in dev
   
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;


