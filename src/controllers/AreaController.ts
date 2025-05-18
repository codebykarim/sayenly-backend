import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllAreas } from "../services/area/getAll";
import { getAreaById } from "../services/area/getById";
import { createArea } from "../services/area/create";
import { updateArea } from "../services/area/update";
import { deleteArea } from "../services/area/delete";
import AppError from "../errors/AppError";

export const getAllAreasController = async (req: Request, res: Response) => {
  try {
    const areas = await getAllAreas();
    return controllerReturn(areas, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get areas", 500);
  }
};

export const getAreaByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const area = await getAreaById(id);

    if (!area) {
      throw new AppError("Area not found", 404);
    }

    return controllerReturn(area, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get area",
      error.statusCode || 500
    );
  }
};

export const createAreaController = async (req: Request, res: Response) => {
  try {
    const areaData = req.body;
    const area = await createArea(areaData);
    return controllerReturn(area, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create area", 500);
  }
};

export const updateAreaController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const areaData = req.body;
    const area = await updateArea(id, areaData);
    return controllerReturn(area, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update area", 500);
  }
};

export const deleteAreaController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const area = await deleteArea(id);
    return controllerReturn({ message: "Area deleted successfully" }, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete area", 500);
  }
};
