import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllOrders } from "../services/order/getAll";
import { getOrderById } from "../services/order/getById";
import { createOrder } from "../services/order/create";
import { updateOrder } from "../services/order/update";
import { deleteOrder } from "../services/order/delete";
import { sendQuoteNotification } from "../utils/notification";
import AppError from "../errors/AppError";

export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    return controllerReturn(orders, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get orders", 500);
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

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

    const order = await createOrder(orderData);
    return controllerReturn(order, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create order", 500);
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    // Check if a quote is being added or updated
    const existingOrder = await getOrderById(id);

    if (!existingOrder) {
      throw new AppError("Order not found", 404);
    }

    // Check if the quote is being added or updated
    const isQuoteUpdated =
      orderData.quote &&
      (existingOrder.quote === null ||
        existingOrder.quote === undefined ||
        existingOrder.quote.toString() !== orderData.quote.toString());

    const order = await updateOrder(id, orderData);

    // Send notification if a quote was added or updated
    if (isQuoteUpdated && order.clientId) {
      const companyName = order.company ? order.company.name : "the company";
      const message = `A quote of ${order.quote} has been provided by ${companyName} for your order.`;
      await sendQuoteNotification(order.clientId, id, message);
    }

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
