import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFaqById = async (id: string) => {
  return await prisma.faq.findUnique({
    where: { id },
  });
};
