import { PrismaClient, BookingStatus } from "@prisma/client";
import { sendBookingReminder } from "./notification";

const prisma = new PrismaClient();

/**
 * Checks for bookings scheduled for tomorrow and sends reminder notifications
 * This function should be called once daily
 */
export const processUpcomingBookingReminders = async () => {
  try {
    // Calculate tomorrow's date (24 hours from now)
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Find all upcoming bookings scheduled for tomorrow
    const upcomingBookings = await prisma.bookings.findMany({
      where: {
        schedule: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
        status: BookingStatus.UPCOMING,
      },
      include: {
        client: true,
        company: true,
        services: true,
      },
    });

    console.log(
      `Found ${upcomingBookings.length} upcoming bookings for tomorrow.`
    );

    // Send notification for each booking
    for (const booking of upcomingBookings) {
      const serviceNames = booking.services
        .slice(0, 2)
        .map((service) => service.name)
        .join(", ");

      const message = `Reminder: You have a booking scheduled tomorrow with Syana for ${serviceNames.split(",").join("،")} at ${booking.schedule.toTimeString()}.`;
      const messageAr = `تذكير: لديك حجز قريب بالتوقيت ${booking.schedule.toTimeString()} للخدمات ${serviceNames.split(",").join("،")} مع Syana.`;

      await sendBookingReminder(
        booking.clientId,
        message,
        messageAr,
        booking.id
      );
      console.log(
        `Sent reminder notification for booking ${booking.id} to user ${booking.clientId}`
      );
    }

    return upcomingBookings.length;
  } catch (error) {
    console.error("Error processing booking reminders:", error);
    throw error;
  }
};
