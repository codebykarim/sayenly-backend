import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteService = async (id: string) => {
  return await prisma.services.delete({
    where: { id },
  });
};
