import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createService = async (
  serviceData: Prisma.ServicesCreateInput
) => {
  return await prisma.services.create({
    data: serviceData,
    include: {
      Projects: true,
      company: true,
    },
  });
};
