import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (
  bookingData: Prisma.BookingsCreateInput
) => {
  return await prisma.bookings.create({
    data: bookingData,
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
      clientReview: true,
    },
  });
};
