import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createReview = async (reviewData: Prisma.ReviewsCreateInput) => {
  return await prisma.reviews.create({
    data: reviewData,
    include: {
      client: true,
      Bookings: true,
    },
  });
};
