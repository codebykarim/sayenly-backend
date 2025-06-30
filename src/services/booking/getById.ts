import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBookingById = async (id: string) => {
  return await prisma.bookings.findUnique({
    where: { id },
    include: {
      client: true,
      services: true,
      company: true,
      clientReview: true,
    },
  });
};
