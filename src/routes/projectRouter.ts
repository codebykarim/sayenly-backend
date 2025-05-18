import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as ProjectController from "../controllers/ProjectController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const projectRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - id
 *         - headline
 *         - description
 *         - images
 *         - address
 *         - date
 *         - htmlContent
 *         - inApp
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/UUID'
 *         headline:
 *           type: string
 *           description: Main headline for the project
 *         description:
 *           type: string
 *           description: Description of the project
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/URL'
 *           description: List of image URLs for the project
 *         address:
 *           type: string
 *           description: Location address of the project
 *         date:
 *           $ref: '#/components/schemas/DateTime'
 *         inApp:
 *           type: boolean
 *           description: Whether the project is visible in the app
 *         htmlContent:
 *           $ref: '#/components/schemas/JSON'
 *           description: Rich text content for the project
 *         services:
 *           type: array
 *           description: Services related to this project
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 $ref: '#/components/schemas/UUID'
 *               name:
 *                 type: string
 *         areas:
 *           type: array
 *           description: Areas related to this project
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 $ref: '#/components/schemas/UUID'
 *               name:
 *                 type: string
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 */

const projectMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /project/get-all:
   *   get:
   *     summary: Get all projects
   *     tags: [Project]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all projects
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Project'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: ProjectController.getAllProjectsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /project/get-by-id:
   *   get:
   *     summary: Get a project by ID
   *     tags: [Project]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The project ID
   *     responses:
   *       200:
   *         description: The project information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Project not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: ProjectController.getProjectByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /project/create:
   *   post:
   *     summary: Create a new project
   *     tags: [Project]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - headline
   *               - description
   *               - images
   *               - address
   *               - date
   *               - htmlContent
   *             properties:
   *               headline:
   *                 type: string
   *                 description: Main headline for the project
   *               description:
   *                 type: string
   *                 description: Description of the project
   *               images:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/URL'
   *                 description: List of image URLs for the project
   *               address:
   *                 type: string
   *                 description: Location address of the project
   *               date:
   *                 $ref: '#/components/schemas/DateTime'
   *               inApp:
   *                 type: boolean
   *                 default: false
   *                 description: Whether the project is visible in the app
   *               htmlContent:
   *                 $ref: '#/components/schemas/JSON'
   *                 description: Rich text content for the project
   *               services:
   *                 type: array
   *                 description: Services to associate with this project
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *               areas:
   *                 type: array
   *                 description: Areas to associate with this project
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *     responses:
   *       200:
   *         description: The created project
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: ProjectController.createProjectController,
    authFunction: isAuth,
    bodyValidation: {
      headline: joi.string().required(),
      description: joi.string().required(),
      images: joi.array().items(joi.string()).required(),
      address: joi.string().required(),
      date: joi.date().required(),
      inApp: joi.boolean().optional().default(false),
      htmlContent: joi.object().required(),
      services: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      areas: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
    },
  },
  /**
   * @swagger
   * /project/update:
   *   put:
   *     summary: Update a project
   *     tags: [Project]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               headline:
   *                 type: string
   *                 description: Main headline for the project
   *               description:
   *                 type: string
   *                 description: Description of the project
   *               images:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/URL'
   *                 description: List of image URLs for the project
   *               address:
   *                 type: string
   *                 description: Location address of the project
   *               date:
   *                 $ref: '#/components/schemas/DateTime'
   *               inApp:
   *                 type: boolean
   *                 description: Whether the project is visible in the app
   *               htmlContent:
   *                 $ref: '#/components/schemas/JSON'
   *                 description: Rich text content for the project
   *               services:
   *                 type: array
   *                 description: Services to associate with this project
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *               areas:
   *                 type: array
   *                 description: Areas to associate with this project
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       $ref: '#/components/schemas/UUID'
   *     responses:
   *       200:
   *         description: The updated project
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Project not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: ProjectController.updateProjectController,
    authFunction: isAuth,
    bodyValidation: {
      headline: joi.string().optional(),
      description: joi.string().optional(),
      images: joi.array().items(joi.string()).optional(),
      address: joi.string().optional(),
      date: joi.date().optional(),
      inApp: joi.boolean().optional(),
      htmlContent: joi.object().optional(),
      services: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      areas: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
    },
  },
  /**
   * @swagger
   * /project/delete:
   *   delete:
   *     summary: Delete a project
   *     tags: [Project]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UUID'
   *         description: The project ID
   *     responses:
   *       200:
   *         description: Project deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Project not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: ProjectController.deleteProjectController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(projectMethods);

// Map the route with method query
projectRouter.route("/project/:method").all(mappedMethods);

export default projectRouter;
