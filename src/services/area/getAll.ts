import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAreas = async () => {
  return await prisma.areas.findMany({
    include: {
      Projects: true,
    },
  });
};
