import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createFaq = async (faqData: Prisma.FaqCreateInput) => {
  return await prisma.faq.create({
    data: faqData,
  });
};
