import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || PrismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
