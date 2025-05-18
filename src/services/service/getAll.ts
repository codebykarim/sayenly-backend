import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllServices = async () => {
  return await prisma.services.findMany({
    include: {
      Projects: true,
      company: true,
    },
  });
};
