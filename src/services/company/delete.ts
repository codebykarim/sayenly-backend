import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteCompany = async (id: string) => {
  return await prisma.company.delete({
    where: { id },
  });
};
