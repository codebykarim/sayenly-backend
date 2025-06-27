import prisma from "../../prisma";

export const getOrderById = async (id: string) => {
  return await prisma.orders.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          nameAr: true,
        },
      },
      // Only include basic service and area info
      services: {
        select: {
          id: true,
          name: true,
          nameAr: true,
        },
      },
      areas: {
        select: {
          id: true,
          name: true,
          nameAr: true,
        },
      },
    },
  });
};

// Create a lightweight version for just checking quote updates with retry logic
export const getOrderForQuoteCheck = async (
  id: string,
  retries: number = 2
) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await prisma.orders.findUnique({
        where: { id },
        select: {
          id: true,
          quote: true,
          clientId: true,
          status: true,
        },
      });
    } catch (error: any) {
      console.error(
        `Attempt ${attempt + 1} failed for getOrderForQuoteCheck:`,
        error.message
      );

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }

      // Wait a bit before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms
      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Retrying getOrderForQuoteCheck in ${delay}ms...`);
    }
  }
};
