import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getReviewById = async (id: string) => {
  return await prisma.reviews.findUnique({
    where: { id },
    include: {
      client: true,
      Bookings: true,
    },
  });
};
