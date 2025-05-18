import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteArea = async (id: string) => {
  return await prisma.areas.delete({
    where: { id },
  });
};
