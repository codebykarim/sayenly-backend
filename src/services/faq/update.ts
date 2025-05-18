import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateFaq = async (id: string, faqData: Prisma.FaqUpdateInput) => {
  return await prisma.faq.update({
    where: { id },
    data: faqData,
  });
};
