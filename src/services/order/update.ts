import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

// Optimized full update WITHOUT transaction for maximum speed
export const updateOrderFullOptimized = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput
) => {
  try {
    console.time("🔍 FULL_UPDATE_TOTAL");

    // Test database connection speed first
    console.time("🔍 DB_CONNECTION_TEST");
    await prisma.$queryRaw`SELECT 1 as test`;
    console.timeEnd("🔍 DB_CONNECTION_TEST");

    console.time("🔍 UPDATE_QUERY");
    // Direct update without transaction but with all includes
    // This is faster than transaction for single operations
    const result = await prisma.orders.update({
      where: { id },
      data: orderData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            inApp: true,
          },
        },
      },
    });
    console.timeEnd("🔍 UPDATE_QUERY");
    console.timeEnd("🔍 FULL_UPDATE_TOTAL");

    console.log(`📊 Update completed for order ${id}`);
    return result;
  } catch (error) {
    console.timeEnd("🔍 UPDATE_QUERY");
    console.timeEnd("🔍 FULL_UPDATE_TOTAL");
    console.error("Error in optimized full update:", error);
    throw error;
  }
};

// Emergency ultra-minimal update for testing
export const updateOrderMinimal = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput
) => {
  try {
    console.time("🔍 MINIMAL_UPDATE");
    const result = await prisma.orders.update({
      where: { id },
      data: orderData,
      select: {
        id: true,
        quote: true,
        status: true,
        clientId: true,
        companyId: true,
        updatedAt: true,
      },
    });
    console.timeEnd("🔍 MINIMAL_UPDATE");
    return result;
  } catch (error) {
    console.timeEnd("🔍 MINIMAL_UPDATE");
    console.error("Error in minimal update:", error);
    throw error;
  }
};

// Fast path for simple updates (quote, status changes) - NO TRANSACTION
export const updateOrderFast = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput
) => {
  try {
    // Direct update without transaction for better performance and stability
    return await prisma.orders.update({
      where: { id },
      data: orderData,
      select: {
        id: true,
        quote: true,
        status: true,
        clientId: true,
        companyId: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in fast update:", error);
    throw error;
  }
};

// Legacy full update with transaction (only for complex multi-table operations)
export const updateOrderWithTransaction = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput
) => {
  try {
    // Only use transaction for actual multi-table operations
    return await prisma.$transaction(
      async (tx) => {
        return await tx.orders.update({
          where: { id },
          data: orderData,
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                nameAr: true,
              },
            },
            services: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                inApp: true,
              },
            },
          },
        });
      },
      {
        maxWait: 2000,
        timeout: 5000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
  } catch (error) {
    console.error("Error updating order with transaction:", error);
    throw error;
  }
};

// Since user always needs full data, optimize for that use case
export const updateOrderSmart = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput,
  requireFullData: boolean = true
) => {
  // For debugging, try minimal update first if you want to test
  // return await updateOrderMinimal(id, orderData);

  // Since you always need full data, always use the optimized full path
  console.log("Using optimized full update (no transaction, all includes)");
  return await updateOrderFullOptimized(id, orderData);

  // Legacy logic kept for reference but not used
  // const simpleFields = ['quote', 'status', 'boq', 'companyId'];
  // const updateKeys = Object.keys(orderData);
  // const isSimpleUpdate = updateKeys.every(key => simpleFields.includes(key)) && !requireFullData;

  // if (isSimpleUpdate && !requireFullData) {
  //   console.log("Using fast path for simple update (no transaction)");
  //   return await updateOrderFast(id, orderData);
  // } else {
  //   console.log("Using optimized full update (no transaction, all includes)");
  //   return await updateOrderFullOptimized(id, orderData);
  // }
};
