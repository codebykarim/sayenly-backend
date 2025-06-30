import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjectById = async (id: string) => {
  return await prisma.projects.findUnique({
    where: { id },
    include: {
      services: true,
    },
  });
};
