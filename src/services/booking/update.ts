import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateBooking = async (
  id: string,
  bookingData: Prisma.BookingsUpdateInput
) => {
  return await prisma.bookings.update({
    where: { id },
    data: bookingData,
    include: {
      client: true,
      services: true,
      company: true,
      clientReview: true,
    },
  });
};
