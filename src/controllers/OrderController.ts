import { Request, Response } from "express";
import { BookingStatus } from "@prisma/client";
import controllerReturn from "../utils/successReturn";
import { getAllOrders } from "../services/order/getAll";
import { getOrderById, getOrderForQuoteCheck } from "../services/order/getById";
import { createOrder } from "../services/order/create";
import { updateOrderSmart } from "../services/order/update";
import { deleteOrder } from "../services/order/delete";
import { createBooking } from "../services/booking/create";
import { sendQuoteNotification } from "../utils/notification";
import AppError from "../errors/AppError";
import {
  withPerformanceTracking,
  PerformanceTimer,
} from "../utils/performance";
import { ensureConnection } from "../prisma";

export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) {
      throw new AppError("User not found", 404);
    }

    // Extract pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate skip value for Prisma
    const skip = (page - 1) * limit;

    const result = await getAllOrders(id, { skip, take: limit });
    return controllerReturn(result, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get orders", 500);
  }
};

export const getAllOrdersDashboardController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.user?.id;
    if (!id) {
      throw new AppError("User not found", 404);
    }

    // Extract pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate skip value for Prisma
    const skip = (page - 1) * limit;

    const result = await getAllOrders(null, { skip, take: limit }, true);
    return controllerReturn(result, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get orders", 500);
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const order = await getOrderById(id as string);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return controllerReturn(order, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get order",
      error.statusCode || 500
    );
  }
};

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    // Set clientId to logged in user if not provided
    if (!orderData.clientId && req.user?.id) {
      orderData.client = { connect: { id: req.user.id } };
    }

    // Transform services array to Prisma connect format
    if (orderData.services && Array.isArray(orderData.services)) {
      orderData.services = {
        connect: orderData.services.map((service: any) => ({ id: service.id })),
      };
    }

    // Transform areas array to Prisma connect format
    if (orderData.areas && Array.isArray(orderData.areas)) {
      orderData.areas = {
        connect: orderData.areas.map((area: any) => ({ id: area.id })),
      };
    }

    const order = await createOrder(orderData);
    return controllerReturn(order, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create order", 500);
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  return withPerformanceTracking(
    "OrderUpdate",
    async (timer: PerformanceTimer) => {
      try {
        const { id } = req.query;
        const orderData = req.body;

        timer.checkpoint("Request parsed");

        // Skip connection verification for speed - let the query handle connection
        // The singleton client should already be connected

        // Get existing order data in parallel with building update data
        const [existingOrder] = await Promise.all([
          getOrderForQuoteCheck(id as string),
          Promise.resolve(), // Placeholder for potential validation
        ]);

        timer.checkpoint("Existing order fetched");

        if (!existingOrder) {
          throw new AppError("Order not found", 404);
        }

        // Quick quote update check
        const isQuoteUpdated =
          orderData.quote &&
          existingOrder.quote?.toString() !== orderData.quote.toString();

        // Check if status is changing to WAITING_APPROVAL
        const isStatusChangingToWaitingApproval =
          orderData.status !== "WAITING_APPROVAL" &&
          existingOrder.status === "WAITING_APPROVAL";

        timer.checkpoint("Quote and status checks completed");

        // Direct update with full data (no conditional logic overhead)
        const order = await updateOrderSmart(id as string, orderData, true);

        timer.checkpoint("Database update completed");

        let createdBooking = null;

        // Create booking if status changed to WAITING_APPROVAL
        if (isStatusChangingToWaitingApproval) {
          try {
            console.log(order.companyId, order.contactNumber);
            // Check that required fields are present for booking creation
            if (!order.companyId) {
              throw new Error(
                "Cannot create booking: order has no assigned company"
              );
            }

            // Transform order data to booking data
            const bookingData = {
              client: { connect: { id: order.clientId } },
              services: {
                connect: order.services.map((service: any) => ({
                  id: service.id,
                })),
              },
              areas: order.areas as any,
              issueDescription: order.issueDescription,
              attachments: order.attachments || [],
              address: order.address,
              schedule: order.schedule,
              contactNumber: order.contactNumber,
              company: { connect: { id: order.companyId } },
              bookingPrice: order.quote || 0,
              status: BookingStatus.UPCOMING,
              notes: {
                boq: order.boq,
              },
            };

            createdBooking = await createBooking(bookingData);
            timer.checkpoint("Booking created");
          } catch (bookingError: any) {
            console.error("Failed to create booking:", bookingError);
            // Don't throw here - the order update was successful
            // Log the error but continue with the response
          }
        }

        // Fire-and-forget notification (completely async)
        if (isQuoteUpdated && existingOrder.clientId) {
          setImmediate(() => {
            const companyName = order.company?.name || "the company";
            const message = `A quote of ${order.quote} has been provided by ${companyName} for your order.`;
            sendQuoteNotification(
              existingOrder.clientId,
              id as string,
              message
            ).catch((error) => console.error("Notification failed:", error));
          });
        }

        timer.checkpoint("Response prepared");

        // Include booking creation status in response
        const response = {
          ...order,
          ...(createdBooking && {
            bookingCreated: true,
            booking: createdBooking,
          }),
        };

        return controllerReturn(response, req, res);
      } catch (error: any) {
        // Simplified error handling
        if (error.code === "P2025") {
          throw new AppError("Order not found", 404);
        }
        throw new AppError(error.message || "Failed to update order", 500);
      }
    }
  );
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const order = await deleteOrder(id as string);
    return controllerReturn(
      { message: "Order deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete order", 500);
  }
};
