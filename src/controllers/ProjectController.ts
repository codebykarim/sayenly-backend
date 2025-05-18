import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllProjects } from "../services/project/getAll";
import { getProjectById } from "../services/project/getById";
import { createProject } from "../services/project/create";
import { updateProject } from "../services/project/update";
import { deleteProject } from "../services/project/delete";
import AppError from "../errors/AppError";

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    return controllerReturn(projects, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get projects", 500);
  }
};

export const getProjectByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return controllerReturn(project, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get project",
      error.statusCode || 500
    );
  }
};

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    const project = await createProject(projectData);
    return controllerReturn(project, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create project", 500);
  }
};

export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    const project = await updateProject(id, projectData);
    return controllerReturn(project, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update project", 500);
  }
};

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await deleteProject(id);
    return controllerReturn(
      { message: "Project deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete project", 500);
  }
};
