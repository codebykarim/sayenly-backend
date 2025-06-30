import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createProject = async (
  projectData: Prisma.ProjectsCreateInput
) => {
  return await prisma.projects.create({
    data: projectData,
    include: {
      services: true,
    },
  });
};
