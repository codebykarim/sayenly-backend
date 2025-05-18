import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createArea = async (areaData: Prisma.AreasCreateInput) => {
  return await prisma.areas.create({
    data: areaData,
    include: {
      Projects: true,
    },
  });
};
