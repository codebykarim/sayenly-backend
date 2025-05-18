import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllReviews = async () => {
  return await prisma.reviews.findMany({
    include: {
      client: true,
      Bookings: true,
    },
  });
};
