import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as ServiceController from "../controllers/ServiceController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const serviceRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - pastJobs
 *         - inApp
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the service
 *         name:
 *           type: string
 *           description: Name of the service
 *         description:
 *           type: string
 *           description: Description of the service
 *         pastJobs:
 *           type: integer
 *           description: Number of past jobs completed for this service
 *         serviceCardImage:
 *           type: string
 *           description: URL to the service's card image
 *         inApp:
 *           type: boolean
 *           description: Whether the service is visible in the app
 *         Projects:
 *           type: array
 *           description: Projects related to this service
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         company:
 *           type: array
 *           description: Companies providing this service
 *           items:
 *             $ref: '#/components/schemas/Company'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the service was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the service was last updated
 */

const serviceMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /service/get-all:
   *   get:
   *     summary: Get all services
   *     tags: [Service]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all services
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Service'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: ServiceController.getAllServicesController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /service/get-by-id:
   *   get:
   *     summary: Get a service by ID
   *     tags: [Service]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The service ID
   *     responses:
   *       200:
   *         description: The service information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Service'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Service not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: ServiceController.getServiceByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /service/create:
   *   post:
   *     summary: Create a new service
   *     tags: [Service]
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
   *               - description
   *               - pastJobs
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the service
   *               description:
   *                 type: string
   *                 description: Description of the service
   *               pastJobs:
   *                 type: integer
   *                 description: Number of past jobs completed for this service
   *               serviceCardImage:
   *                 type: string
   *                 description: URL to the service's card image
   *               inApp:
   *                 type: boolean
   *                 default: false
   *                 description: Whether the service is visible in the app
   *               Projects:
   *                 type: array
   *                 description: Projects to associate with this service
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Project ID
   *               company:
   *                 type: array
   *                 description: Companies providing this service
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Company ID
   *     responses:
   *       200:
   *         description: The created service
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Service'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: ServiceController.createServiceController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().required(),
      description: joi.string().required(),
      pastJobs: joi.number().required(),
      serviceCardImage: joi.string().optional(),
      inApp: joi.boolean().optional().default(false),
      Projects: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      company: joi
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
   * /service/update:
   *   put:
   *     summary: Update a service
   *     tags: [Service]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The service ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the service
   *               description:
   *                 type: string
   *                 description: Description of the service
   *               pastJobs:
   *                 type: integer
   *                 description: Number of past jobs completed for this service
   *               serviceCardImage:
   *                 type: string
   *                 description: URL to the service's card image
   *               inApp:
   *                 type: boolean
   *                 description: Whether the service is visible in the app
   *               Projects:
   *                 type: array
   *                 description: Projects to associate with this service
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Project ID
   *               company:
   *                 type: array
   *                 description: Companies providing this service
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Company ID
   *     responses:
   *       200:
   *         description: The updated service
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Service'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Service not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: ServiceController.updateServiceController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().optional(),
      description: joi.string().optional(),
      pastJobs: joi.number().optional(),
      serviceCardImage: joi.string().optional(),
      inApp: joi.boolean().optional(),
      Projects: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .optional(),
      company: joi
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
   * /service/delete:
   *   delete:
   *     summary: Delete a service
   *     tags: [Service]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The service ID
   *     responses:
   *       200:
   *         description: Service deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Service not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: ServiceController.deleteServiceController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(serviceMethods);

// Map the route with method query
serviceRouter.route("/service/:method").all(mappedMethods);

export default serviceRouter;
