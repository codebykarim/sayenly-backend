import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateReview = async (
  id: string,
  reviewData: Prisma.ReviewsUpdateInput
) => {
  return await prisma.reviews.update({
    where: { id },
    data: reviewData,
    include: {
      client: true,
      Bookings: true,
    },
  });
};
