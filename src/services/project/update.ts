import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProject = async (
  id: string,
  projectData: Prisma.ProjectsUpdateInput
) => {
  return await prisma.projects.update({
    where: { id },
    data: projectData,
    include: {
      services: true,
      areas: true,
    },
  });
};
