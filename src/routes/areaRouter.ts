import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as AreaController from "../controllers/AreaController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const areaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - inApp
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the area
 *         name:
 *           type: string
 *           description: Name of the area
 *         areaImage:
 *           type: string
 *           description: URL to the area's image
 *         inApp:
 *           type: boolean
 *           description: Whether the area is visible in the app
 *         Projects:
 *           type: array
 *           description: Projects related to this area
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               headline:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the area was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the area was last updated
 */

const areaMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /area/get-all:
   *   get:
   *     summary: Get all areas
   *     tags: [Area]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all areas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Area'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: AreaController.getAllAreasController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /area/get-by-id:
   *   get:
   *     summary: Get an area by ID
   *     tags: [Area]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The area ID
   *     responses:
   *       200:
   *         description: The area information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Area'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Area not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: AreaController.getAreaByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /area/create:
   *   post:
   *     summary: Create a new area
   *     tags: [Area]
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
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the area
   *               areaImage:
   *                 type: string
   *                 description: URL to the area's image
   *               inApp:
   *                 type: boolean
   *                 default: false
   *                 description: Whether the area is visible in the app
   *               Projects:
   *                 type: array
   *                 description: Projects to associate with this area
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Project ID
   *     responses:
   *       200:
   *         description: The created area
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Area'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: AreaController.createAreaController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().required(),
      areaImage: joi.string().optional(),
      inApp: joi.boolean().optional().default(false),
      Projects: joi
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
   * /area/update:
   *   put:
   *     summary: Update an area
   *     tags: [Area]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The area ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the area
   *               areaImage:
   *                 type: string
   *                 description: URL to the area's image
   *               inApp:
   *                 type: boolean
   *                 description: Whether the area is visible in the app
   *               Projects:
   *                 type: array
   *                 description: Projects to associate with this area
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Project ID
   *     responses:
   *       200:
   *         description: The updated area
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Area'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Area not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: AreaController.updateAreaController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().optional(),
      areaImage: joi.string().optional(),
      inApp: joi.boolean().optional(),
      Projects: joi
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
   * /area/delete:
   *   delete:
   *     summary: Delete an area
   *     tags: [Area]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The area ID
   *     responses:
   *       200:
   *         description: Area deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Area not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: AreaController.deleteAreaController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(areaMethods);

// Map the route with method query
areaRouter.route("/area/:method").all(mappedMethods);

export default areaRouter;
