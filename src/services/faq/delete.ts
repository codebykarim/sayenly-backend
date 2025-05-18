import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteFaq = async (id: string) => {
  return await prisma.faq.delete({
    where: { id },
  });
};
