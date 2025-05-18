import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllFaqs } from "../services/faq/getAll";
import { getFaqById } from "../services/faq/getById";
import { createFaq } from "../services/faq/create";
import { updateFaq } from "../services/faq/update";
import { deleteFaq } from "../services/faq/delete";
import AppError from "../errors/AppError";

export const getAllFaqsController = async (req: Request, res: Response) => {
  try {
    const faqs = await getAllFaqs();
    return controllerReturn(faqs, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get FAQs", 500);
  }
};

export const getFaqByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await getFaqById(id);

    if (!faq) {
      throw new AppError("FAQ not found", 404);
    }

    return controllerReturn(faq, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get FAQ",
      error.statusCode || 500
    );
  }
};

export const createFaqController = async (req: Request, res: Response) => {
  try {
    const faqData = req.body;
    const faq = await createFaq(faqData);
    return controllerReturn(faq, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create FAQ", 500);
  }
};

export const updateFaqController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faqData = req.body;
    const faq = await updateFaq(id, faqData);
    return controllerReturn(faq, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update FAQ", 500);
  }
};

export const deleteFaqController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await deleteFaq(id);
    return controllerReturn({ message: "FAQ deleted successfully" }, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete FAQ", 500);
  }
};
