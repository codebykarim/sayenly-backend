import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAreaById = async (id: string) => {
  return await prisma.areas.findUnique({
    where: { id },
    include: {
      Projects: true,
    },
  });
};
