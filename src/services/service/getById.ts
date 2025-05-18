import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getServiceById = async (id: string) => {
  return await prisma.services.findUnique({
    where: { id },
    include: {
      Projects: true,
      company: true,
    },
  });
};
