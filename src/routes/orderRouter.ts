import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as OrderController from "../controllers/OrderController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const orderRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - clientId
 *         - issueDescription
 *         - address
 *         - schedule
 *         - contactNumber
 *         - companyId
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the order
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who created the order
 *         services:
 *           type: array
 *           description: List of services included in the order
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *         areas:
 *           type: array
 *           description: List of areas included in the order
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *         issueDescription:
 *           type: string
 *           description: Description of the issue to be addressed
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: List of attachment URLs
 *         address:
 *           type: string
 *           description: Location address for the order
 *         schedule:
 *           type: string
 *           format: date-time
 *           description: Scheduled date and time for the order
 *         contactNumber:
 *           type: string
 *           description: Contact number for the order
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: The ID of the company providing the service
 *         quote:
 *           type: number
 *           description: Price quote for the order
 *         status:
 *           type: string
 *           enum: [WAITING_QUOTE, WAITING_APPROVAL, REJECTED, CANCELLED]
 *           description: Current status of the order
 *         boq:
 *           type: object
 *           description: Bill of quantities for the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the order was last updated
 */

const orderMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /order/get-all:
   *   get:
   *     summary: Get all orders
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all orders
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: OrderController.getAllOrdersController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /order/get-by-id:
   *   get:
   *     summary: Get an order by ID
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The order ID
   *     responses:
   *       200:
   *         description: The order information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: OrderController.getOrderByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /order/create:
   *   post:
   *     summary: Create a new order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - issueDescription
   *               - address
   *               - schedule
   *               - contactNumber
   *               - companyId
   *               - services
   *               - areas
   *             properties:
   *               issueDescription:
   *                 type: string
   *                 description: Description of the issue to be addressed
   *               attachments:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of attachment URLs
   *               address:
   *                 type: string
   *                 description: Location address for the order
   *               schedule:
   *                 type: string
   *                 format: date-time
   *                 description: Scheduled date and time for the order
   *               contactNumber:
   *                 type: string
   *                 description: Contact number for the order
   *               companyId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the company providing the service
   *               quote:
   *                 type: number
   *                 description: Price quote for the order
   *               status:
   *                 type: string
   *                 enum: [WAITING_QUOTE, WAITING_APPROVAL, REJECTED, CANCELLED]
   *                 default: WAITING_QUOTE
   *                 description: Status of the order
   *               boq:
   *                 type: object
   *                 description: Bill of quantities for the order
   *               services:
   *                 type: array
   *                 description: List of services included in the order
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Service ID
   *               areas:
   *                 type: array
   *                 description: List of areas included in the order
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Area ID
   *     responses:
   *       200:
   *         description: The created order
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: OrderController.createOrderController,
    authFunction: isAuth,
    bodyValidation: {
      issueDescription: joi.string().required(),
      attachments: joi.array().items(joi.string()).optional(),
      address: joi.string().required(),
      schedule: joi.date().required(),
      contactNumber: joi.string().required(),
      companyId: joi.string().guid().optional(),
      quote: joi.number().optional(),
      type: joi.string().valid("NEW", "EXISTING").optional().default("NEW"),
      status: joi
        .string()
        .valid("WAITING_QUOTE")
        .optional()
        .default("WAITING_QUOTE"),
      boq: joi.object().optional(),
      services: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .required(),
      areas: joi
        .array()
        .items(
          joi.object({
            id: joi.string().guid().required(),
          })
        )
        .required(),
    },
  },
  /**
   * @swagger
   * /order/update:
   *   put:
   *     summary: Update an order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The order ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               issueDescription:
   *                 type: string
   *                 description: Description of the issue to be addressed
   *               attachments:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of attachment URLs
   *               address:
   *                 type: string
   *                 description: Location address for the order
   *               schedule:
   *                 type: string
   *                 format: date-time
   *                 description: Scheduled date and time for the order
   *               contactNumber:
   *                 type: string
   *                 description: Contact number for the order
   *               companyId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the company providing the service
   *               quote:
   *                 type: number
   *                 description: Price quote for the order
   *               status:
   *                 type: string
   *                 enum: [WAITING_QUOTE, WAITING_APPROVAL, REJECTED, CANCELLED]
   *                 description: Status of the order
   *               boq:
   *                 type: object
   *                 description: Bill of quantities for the order
   *               services:
   *                 type: array
   *                 description: List of services included in the order
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Service ID
   *               areas:
   *                 type: array
   *                 description: List of areas included in the order
   *                 items:
   *                   type: object
   *                   required:
   *                     - id
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                       description: Area ID
   *     responses:
   *       200:
   *         description: The updated order
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: OrderController.updateOrderController,
    authFunction: isAuth,
    bodyValidation: {
      issueDescription: joi.string().optional(),
      attachments: joi.array().items(joi.string()).optional(),
      address: joi.string().optional(),
      schedule: joi.date().optional(),
      contactNumber: joi.string().optional(),
      companyId: joi.string().guid().optional(),
      quote: joi.number().optional(),
      status: joi
        .string()
        .valid(
          "WAITING_QUOTE",
          "WAITING_APPROVAL",
          "REJECTED",
          "CANCELLED",
          "APPROVED"
        )
        .optional(),
      boq: joi.object().optional(),
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
   * /order/delete:
   *   delete:
   *     summary: Delete an order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The order ID
   *     responses:
   *       200:
   *         description: Order deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Order not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: OrderController.deleteOrderController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(orderMethods);

// Map the route with method query
orderRouter.route("/order/:method").all(mappedMethods);

export default orderRouter;
