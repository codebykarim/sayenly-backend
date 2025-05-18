import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateService = async (
  id: string,
  serviceData: Prisma.ServicesUpdateInput
) => {
  return await prisma.services.update({
    where: { id },
    data: serviceData,
    include: {
      Projects: true,
      company: true,
    },
  });
};
