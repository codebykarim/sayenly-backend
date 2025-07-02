import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as UserController from "../controllers/UserController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const userRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - emailVerified
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         emailVerified:
 *           type: boolean
 *           description: Whether the user's email is verified
 *         image:
 *           type: string
 *           description: URL to the user's profile image
 *         nationality:
 *           type: string
 *           enum: [EMIRATI, OTHER]
 *           description: User's nationality
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *
 * @swagger
 * /api/auth/phone-number/send-otp:
 *   post:
 *     summary: Send an OTP code to a phone number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number in E.164 format (e.g., +971XXXXXXXXX)
 *                 example: "+971501234567"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Bad request - Invalid phone number format
 *       429:
 *         description: Too many requests - OTP sending rate limited
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/auth/phone-number/verify:
 *   post:
 *     summary: Verify a phone number with an OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number in E.164 format
 *                 example: "+971501234567"
 *               code:
 *                 type: string
 *                 description: The OTP code received via SMS
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification successful"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid code or phone number
 *       401:
 *         description: Unauthorized - Invalid or expired OTP code
 *       500:
 *         description: Server error
 *
 * @swagger
 * /auth/update-user:
 *   post:
 *     summary: Update the current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               image:
 *                 type: string
 *                 description: URL to the user's profile image
 *               nationality:
 *                 type: string
 *                 enum: [EMIRATI, OTHER]
 *                 description: User's nationality
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       400:
 *         description: Bad request - Validation error
 *       500:
 *         description: Server error
 */

const userMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /user/get-all:
   *   get:
   *     summary: Get all users
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: UserController.getAllUsersController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /user/get-by-id:
   *   get:
   *     summary: Get a user by ID
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     responses:
   *       200:
   *         description: The user information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: UserController.getUserByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /user/update:
   *   put:
   *     summary: Update a user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               image:
   *                 type: string
   *               settings:
   *                 type: object
   *               nationality:
   *                 type: string
   *                 enum: [EMIRATI, OTHER]
   *               phoneNumber:
   *                 type: string
   *     responses:
   *       200:
   *         description: The updated user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: UserController.updateUserController,
    authFunction: isAuth,
    bodyValidation: {
      name: joi.string().optional(),
      image: joi.string().optional(),
      settings: joi.object().optional(),
      nationality: joi.string().valid("EMIRATI", "OTHER").optional(),
      phoneNumber: joi.string().optional(),
    },
  },
  /**
   * @swagger
   * /user/delete:
   *   delete:
   *     summary: Delete a user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: UserController.deleteUserController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /user/update-fcm-token:
   *   post:
   *     summary: Update the FCM token for a user (deprecated)
   *     description: Update a single FCM token for push notifications. This method is deprecated, use register-device instead.
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fcmToken
   *             properties:
   *               fcmToken:
   *                 type: string
   *                 description: The Firebase Cloud Messaging token
   *     responses:
   *       200:
   *         description: FCM token updated successfully
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - FCM token is required
   *       500:
   *         description: Server error
   */
  "update-fcm-token": {
    httpMethod: "POST",
    controllerFunction: UserController.updateFcmTokenController,
    authFunction: isAuth,
    bodyValidation: {
      fcmToken: joi.string().required(),
    },
  },
  /**
   * @swagger
   * /user/register-device:
   *   post:
   *     summary: Register a device for push notifications
   *     description: Register a device to receive push notifications. Multiple devices can be registered per user.
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - deviceToken
   *             properties:
   *               deviceToken:
   *                 type: string
   *                 description: The Firebase Cloud Messaging device token
   *               deviceInfo:
   *                 type: object
   *                 properties:
   *                   platform:
   *                     type: string
   *                     description: The device platform (e.g., iOS, Android)
   *                   osVersion:
   *                     type: string
   *                     description: The operating system version
   *                   model:
   *                     type: string
   *                     description: The device model
   *                   appVersion:
   *                     type: string
   *                     description: The app version
   *     responses:
   *       200:
   *         description: Device registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 deviceCount:
   *                   type: integer
   *                   description: Number of registered devices for this user
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - Device token is required
   *       500:
   *         description: Server error
   */
  "register-device": {
    httpMethod: "POST",
    controllerFunction: UserController.registerDeviceController,
    authFunction: isAuth,
    bodyValidation: {
      deviceToken: joi.string().required(),
      deviceInfo: joi.object().optional().keys({
        platform: joi.string().optional(),
        osVersion: joi.string().optional(),
        model: joi.string().optional(),
        appVersion: joi.string().optional(),
      }),
    },
  },
  /**
   * @swagger
   * /user/unregister-device:
   *   post:
   *     summary: Unregister a device to stop push notifications
   *     description: Unregister a device to stop receiving push notifications.
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - deviceToken
   *             properties:
   *               deviceToken:
   *                 type: string
   *                 description: The Firebase Cloud Messaging device token to unregister
   *     responses:
   *       200:
   *         description: Device unregistered successfully or no device found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 deviceCount:
   *                   type: integer
   *                   description: Remaining number of registered devices for this user
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - Device token is required
   *       500:
   *         description: Server error
   */
  "unregister-device": {
    httpMethod: "POST",
    controllerFunction: UserController.unregisterDeviceController,
    authFunction: isAuth,
    bodyValidation: {
      deviceToken: joi.string().required(),
    },
  },
};

const mappedMethods = init(userMethods);

// Map the route with method query
userRouter.route("/user/:method").all(mappedMethods);

export default userRouter;
