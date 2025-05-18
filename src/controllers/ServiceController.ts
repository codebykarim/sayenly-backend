import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllServices } from "../services/service/getAll";
import { getServiceById } from "../services/service/getById";
import { createService } from "../services/service/create";
import { updateService } from "../services/service/update";
import { deleteService } from "../services/service/delete";
import AppError from "../errors/AppError";

export const getAllServicesController = async (req: Request, res: Response) => {
  try {
    const services = await getAllServices();
    return controllerReturn(services, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get services", 500);
  }
};

export const getServiceByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    return controllerReturn(service, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get service",
      error.statusCode || 500
    );
  }
};

export const createServiceController = async (req: Request, res: Response) => {
  try {
    const serviceData = req.body;
    const service = await createService(serviceData);
    return controllerReturn(service, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create service", 500);
  }
};

export const updateServiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceData = req.body;
    const service = await updateService(id, serviceData);
    return controllerReturn(service, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update service", 500);
  }
};

export const deleteServiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await deleteService(id);
    return controllerReturn(
      { message: "Service deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete service", 500);
  }
};
