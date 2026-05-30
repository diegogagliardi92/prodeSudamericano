import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options: any = { log: process.env.NODE_ENV === "development" ? ["query"] : [] };

export const prisma = globalForPrisma.prisma ?? new PrismaClient(options);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
