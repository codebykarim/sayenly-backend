import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllBookings = async () => {
  return await prisma.bookings.findMany({
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
      clientReview: true,
    },
  });
};
