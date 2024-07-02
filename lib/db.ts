import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// for dev environment to avoid creating unnecessarry multiple PrismaClients
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
