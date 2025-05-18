import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllReviews } from "../services/review/getAll";
import { getReviewById } from "../services/review/getById";
import { createReview } from "../services/review/create";
import { updateReview } from "../services/review/update";
import { deleteReview } from "../services/review/delete";
import AppError from "../errors/AppError";

export const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviews();
    return controllerReturn(reviews, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get reviews", 500);
  }
};

export const getReviewByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    return controllerReturn(review, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get review",
      error.statusCode || 500
    );
  }
};

export const createReviewController = async (req: Request, res: Response) => {
  try {
    const reviewData = req.body;

    // Set clientId to logged in user if not provided
    if (!reviewData.clientId && req.user?.id) {
      reviewData.client = { connect: { id: req.user.id } };
    }

    const review = await createReview(reviewData);
    return controllerReturn(review, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create review", 500);
  }
};

export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviewData = req.body;

    // Make sure user can only update their own reviews
    if (req.user) {
      const existingReview = await getReviewById(id);
      if (existingReview && existingReview.clientId !== req.user.id) {
        throw new AppError("You can only update your own reviews", 403);
      }
    }

    const review = await updateReview(id, reviewData);
    return controllerReturn(review, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update review", 500);
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Make sure user can only delete their own reviews
    if (req.user) {
      const existingReview = await getReviewById(id);
      if (existingReview && existingReview.clientId !== req.user.id) {
        throw new AppError("You can only delete your own reviews", 403);
      }
    }

    const review = await deleteReview(id);
    return controllerReturn(
      { message: "Review deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete review", 500);
  }
};
