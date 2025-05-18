import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFaqs = async () => {
  return await prisma.faq.findMany();
};
