import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as CompanyController from "../controllers/CompanyController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const companyRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - phoneNumbers
 *         - emailAddresses
 *         - addresses
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/UUID'
 *         name:
 *           type: string
 *           description: Name of the company
 *         logo:
 *           $ref: '#/components/schemas/URL'
 *           description: URL to the company's logo
 *         phoneNumbers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PhoneNumber'
 *           description: List of phone numbers for the company
 *         emailAddresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Email'
 *           description: List of email addresses for the company
 *         addresses:
 *           type: array
 *           items:
 *             type: string
 *           description: List of physical addresses for the company
 *         services:
 *           type: array
 *           description: Services provided by this company
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 $ref: '#/components/schemas/UUID'
 *               name:
 *                 type: string
 *         totalEarnings:
 *           type: number
 *           description: Total earnings for the company
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 */

const companyMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /company/get-all:
   *   get:
   *     summary: Get all companies
   *     tags: [Company]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all companies
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Company'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: CompanyController.getAllCompaniesController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /company/get-by-id:
   *   get:
   *     summary: Get a company by ID
   *     tags: [Company]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The company ID
   *     responses:
   *       200:
   *         description: The company information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Company'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Company not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: CompanyController.getCompanyByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /company/create:
   *   post:
   *     summary: Create a new company
   *     tags: [Company]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - phoneNumbers
   *               - emailAddresses
   *               - addresses
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the company
   *               logo:
   *                 $ref: '#/components/schemas/URL'
   *                 description: URL to the company's logo
   *               phoneNumbers:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/PhoneNumber'
   *                 description: List of phone numbers for the company
   *               emailAddresses:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Email'
   *                 description: List of email addresses for the company
   *               addresses:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of physical addresses for the company
   *               services:
   *                 type: array
   *                 description: Services to associate with this company
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *               totalEarnings:
   *                 type: number
   *                 description: Total earnings for the company
   *     responses:
   *       200:
   *         description: The created company
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Company'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: CompanyController.createCompanyController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().required(),
      logo: joi.string().optional(),
      phoneNumbers: joi.array().items(joi.string()).required(),
      emailAddresses: joi.array().items(joi.string().email()).required(),
      addresses: joi.array().items(joi.string()).required(),
      services: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      totalEarnings: joi.number().optional(),
    },
  },
  /**
   * @swagger
   * /company/update:
   *   put:
   *     summary: Update a company
   *     tags: [Company]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The company ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the company
   *               logo:
   *                 $ref: '#/components/schemas/URL'
   *                 description: URL to the company's logo
   *               phoneNumbers:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/PhoneNumber'
   *                 description: List of phone numbers for the company
   *               emailAddresses:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Email'
   *                 description: List of email addresses for the company
   *               addresses:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of physical addresses for the company
   *               services:
   *                 type: array
   *                 description: Services to associate with this company
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *               totalEarnings:
   *                 type: number
   *                 description: Total earnings for the company
   *     responses:
   *       200:
   *         description: The updated company
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Company'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Company not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: CompanyController.updateCompanyController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().optional(),
      logo: joi.string().optional(),
      phoneNumbers: joi.array().items(joi.string()).optional(),
      emailAddresses: joi.array().items(joi.string().email()).optional(),
      addresses: joi.array().items(joi.string()).optional(),
      services: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      totalEarnings: joi.number().optional(),
    },
  },
  /**
   * @swagger
   * /company/delete:
   *   delete:
   *     summary: Delete a company
   *     tags: [Company]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The company ID
   *     responses:
   *       200:
   *         description: Company deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Company not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: CompanyController.deleteCompanyController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(companyMethods);

// Map the route with method query
companyRouter.route("/company/:method").all(mappedMethods);

export default companyRouter;
