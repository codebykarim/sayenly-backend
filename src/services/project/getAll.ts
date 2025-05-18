import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProjects = async () => {
  return await prisma.projects.findMany({
    include: {
      services: true,
      areas: true,
    },
  });
};
