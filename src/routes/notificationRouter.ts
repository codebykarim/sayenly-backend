import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as NotificationController from "../controllers/NotificationController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const notificationRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - message
 *         - read
 *         - type
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the notification
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user this notification belongs to
 *         message:
 *           type: string
 *           description: The notification message
 *         read:
 *           type: boolean
 *           description: Whether the notification has been read
 *         type:
 *           type: string
 *           enum: [SAYENLY, REMINDER, QUOTE]
 *           description: The type of notification
 *         route:
 *           type: object
 *           description: Optional route information for deep linking
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was last updated
 */

const notificationMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /notification/get-all:
   *   get:
   *     summary: Get all notifications
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all notifications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Notification'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: NotificationController.getAllNotificationsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /notification/get-by-id:
   *   get:
   *     summary: Get a notification by ID
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The notification ID
   *     responses:
   *       200:
   *         description: The notification information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Notification'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Notification not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: NotificationController.getNotificationByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /notification/create:
   *   post:
   *     summary: Create a new notification
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *               - type
   *             properties:
   *               message:
   *                 type: string
   *                 description: The notification message
   *               read:
   *                 type: boolean
   *                 default: false
   *                 description: Whether the notification has been read
   *               type:
   *                 type: string
   *                 enum: [SAYENLY, REMINDER, QUOTE]
   *                 description: The type of notification
   *               route:
   *                 type: object
   *                 description: Optional route information for deep linking
   *               userId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the user this notification belongs to (defaults to authenticated user if not provided)
   *     responses:
   *       200:
   *         description: The created notification
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Notification'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: NotificationController.createNotificationController,
    authFunction: isAuth,
    bodyValidation: {
      message: joi.string().required(),
      read: joi.boolean().optional().default(false),
      type: joi.string().valid("SAYENLY", "REMINDER", "QUOTE").required(),
      route: joi.object().optional(),
      userId: joi.string().guid().optional(),
    },
  },
  /**
   * @swagger
   * /notification/update:
   *   put:
   *     summary: Update a notification
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The notification ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               message:
   *                 type: string
   *                 description: The notification message
   *               read:
   *                 type: boolean
   *                 description: Whether the notification has been read
   *               type:
   *                 type: string
   *                 enum: [SAYENLY, REMINDER, QUOTE]
   *                 description: The type of notification
   *               route:
   *                 type: object
   *                 description: Optional route information for deep linking
   *               userId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the user this notification belongs to
   *     responses:
   *       200:
   *         description: The updated notification
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Notification'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Notification not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: NotificationController.updateNotificationController,
    authFunction: isAuth,
    bodyValidation: {
      message: joi.string().optional(),
      read: joi.boolean().optional(),
      type: joi.string().valid("SAYENLY", "REMINDER", "QUOTE").optional(),
      route: joi.object().optional(),
      userId: joi.string().guid().optional(),
    },
  },
  "read-one": {
    httpMethod: "PUT",
    controllerFunction: NotificationController.readOneNotificationController,
    authFunction: isAuth,
  },
  "read-all": {
    httpMethod: "PUT",
    controllerFunction: NotificationController.readAllNotificationsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /notification/delete:
   *   delete:
   *     summary: Delete a notification
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The notification ID
   *     responses:
   *       200:
   *         description: Notification deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Notification not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: NotificationController.deleteNotificationController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /notification/send-system:
   *   post:
   *     summary: Send a system notification to a user
   *     tags: [Notification]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - message
   *             properties:
   *               userId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the user to send the notification to
   *               message:
   *                 type: string
   *                 description: The notification message
   *               route:
   *                 type: object
   *                 description: Optional route information for deep linking
   *     responses:
   *       200:
   *         description: Notification sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Notification'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  "send-system": {
    httpMethod: "POST",
    controllerFunction: NotificationController.sendSystemNotificationController,
    authFunction: isAuth,
    bodyValidation: {
      userId: joi.string().guid().required(),
      message: joi.string().required(),
      route: joi.object().optional(),
    },
  },
};

const mappedMethods = init(notificationMethods);

// Map the route with method query
notificationRouter.route("/notification/:method").all(mappedMethods);

export default notificationRouter;
