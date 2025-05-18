import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteProject = async (id: string) => {
  return await prisma.projects.delete({
    where: { id },
  });
};
