import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteBooking = async (id: string) => {
  return await prisma.bookings.delete({
    where: { id },
  });
};
