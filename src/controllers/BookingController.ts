import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllBookings } from "../services/booking/getAll";
import { getBookingById } from "../services/booking/getById";
import { createBooking } from "../services/booking/create";
import { updateBooking } from "../services/booking/update";
import { deleteBooking } from "../services/booking/delete";
import AppError from "../errors/AppError";

export const getAllBookingsController = async (req: Request, res: Response) => {
  try {
    const bookings = await getAllBookings();
    return controllerReturn(bookings, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get bookings", 500);
  }
};

export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return controllerReturn(booking, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get booking",
      error.statusCode || 500
    );
  }
};

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;

    // Set clientId to logged in user if not provided
    if (!bookingData.clientId && req.user?.id) {
      bookingData.client = { connect: { id: req.user.id } };
    }

    const booking = await createBooking(bookingData);
    return controllerReturn(booking, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create booking", 500);
  }
};

export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookingData = req.body;
    const booking = await updateBooking(id, bookingData);
    return controllerReturn(booking, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update booking", 500);
  }
};

export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await deleteBooking(id);
    return controllerReturn(
      { message: "Booking deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete booking", 500);
  }
};
