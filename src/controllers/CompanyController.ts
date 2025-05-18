import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllCompanies } from "../services/company/getAll";
import { getCompanyById } from "../services/company/getById";
import { createCompany } from "../services/company/create";
import { updateCompany } from "../services/company/update";
import { deleteCompany } from "../services/company/delete";
import AppError from "../errors/AppError";

export const getAllCompaniesController = async (
  req: Request,
  res: Response
) => {
  try {
    const companies = await getAllCompanies();
    return controllerReturn(companies, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get companies", 500);
  }
};

export const getCompanyByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await getCompanyById(id);

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return controllerReturn(company, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get company",
      error.statusCode || 500
    );
  }
};

export const createCompanyController = async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    const company = await createCompany(companyData);
    return controllerReturn(company, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create company", 500);
  }
};

export const updateCompanyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyData = req.body;
    const company = await updateCompany(id, companyData);
    return controllerReturn(company, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update company", 500);
  }
};

export const deleteCompanyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await deleteCompany(id);
    return controllerReturn(
      { message: "Company deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete company", 500);
  }
};
