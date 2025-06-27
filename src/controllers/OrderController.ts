import { Request, Response } from "express";
import { BookingStatus } from "@prisma/client";
import controllerReturn from "../utils/successReturn";
import { getAllOrders } from "../services/order/getAll";
import { getOrderById } from "../services/order/getById";
import { createOrder } from "../services/order/create";
import { updateOrder } from "../services/order/update";
import { deleteOrder } from "../services/order/delete";
import { createBooking } from "../services/booking/create";
import { sendQuoteNotification } from "../utils/notification";
import AppError from "../errors/AppError";

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
  try {
    const { id } = req.query;
    const orderData = req.body;

    // Check if a quote is being added or updated
    const existingOrder = await getOrderById(id as string);

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    // Check if the quote is being added or updated
    const isQuoteUpdated =
      orderData.quote &&
      (existingOrder.quote === null ||
        existingOrder.quote === undefined ||
        existingOrder.quote.toString() !== orderData.quote.toString());

    const order = await updateOrder(id as string, orderData);

    // Send notification if a quote was added or updated
    if (isQuoteUpdated && order.clientId) {
      const companyName = order.company ? order.company.name : "the company";
      const message = `A quote of ${order.quote} has been provided by ${companyName} for your order.`;
      await sendQuoteNotification(order.clientId, id as string, message);
    }

    // Create booking if order status is approved
    // if (
    //   orderData.status === "APPROVED" &&
    //   existingOrder.status !== "APPROVED"
    // ) {
    //   if (!order.companyId || !order.quote) {
    //     throw new AppError(
    //       "Cannot create booking: Company and quote are required for approved orders",
    //       400
    //     );
    //   }

    //   const bookingData = {
    //     client: { connect: { id: order.clientId } },
    //     services: {
    //       connect: order.services.map((service: any) => ({ id: service.id })),
    //     },
    //     areas: {
    //       connect: order.areas.map((area: any) => ({ id: area.id })),
    //     },
    //     issueDescription: order.issueDescription,
    //     attachments: order.attachments,
    //     address: order.address,
    //     schedule: order.schedule,
    //     contactNumber: order.contactNumber,
    //     company: { connect: { id: order.companyId } },
    //     bookingPrice: order.quote,
    //     status: BookingStatus.UPCOMING,
    //   };

    //   const booking = await createBooking(bookingData);

    //   return controllerReturn(
    //     {
    //       order,
    //       booking,
    //       message: "Order approved and booking created successfully",
    //     },
    //     req,
    //     res
    //   );
    // }

    return controllerReturn(order, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update order", 500);
  }
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await deleteOrder(id);
    return controllerReturn(
      { message: "Order deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete order", 500);
  }
};
