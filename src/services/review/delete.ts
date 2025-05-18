import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteReview = async (id: string) => {
  return await prisma.reviews.delete({
    where: { id },
  });
};
