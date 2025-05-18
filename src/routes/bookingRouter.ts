import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as BookingController from "../controllers/BookingController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const bookingRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - id
 *         - clientId
 *         - issueDescription
 *         - address
 *         - schedule
 *         - contactNumber
 *         - companyId
 *         - bookingPrice
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the booking
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who created the booking
 *         services:
 *           type: array
 *           description: List of services included in the booking
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
 *           description: List of areas included in the booking
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
 *           description: Location address for the booking
 *         schedule:
 *           type: string
 *           format: date-time
 *           description: Scheduled date and time for the booking
 *         contactNumber:
 *           type: string
 *           description: Contact number for the booking
 *         companyId:
 *           type: string
 *           format: uuid
 *           description: The ID of the company providing the service
 *         bookingPrice:
 *           type: number
 *           description: Price of the booking
 *         status:
 *           type: string
 *           enum: [UPCOMING, ONGOING, COMPLETED, CANCELLED]
 *           description: Current status of the booking
 *         notes:
 *           type: object
 *           description: Additional notes for the booking
 *         cancellationReason:
 *           type: string
 *           description: Reason for cancellation if booking is cancelled
 *         reviewId:
 *           type: string
 *           format: uuid
 *           description: ID of the associated review if any
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the booking was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the booking was last updated
 */

const bookingMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /booking/get-all:
   *   get:
   *     summary: Get all bookings
   *     tags: [Booking]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all bookings
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Booking'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: BookingController.getAllBookingsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /booking/get-by-id:
   *   get:
   *     summary: Get a booking by ID
   *     tags: [Booking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The booking ID
   *     responses:
   *       200:
   *         description: The booking information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Booking'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: BookingController.getBookingByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /booking/create:
   *   post:
   *     summary: Create a new booking
   *     tags: [Booking]
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
   *               - bookingPrice
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
   *                 description: Location address for the booking
   *               schedule:
   *                 type: string
   *                 format: date-time
   *                 description: Scheduled date and time for the booking
   *               contactNumber:
   *                 type: string
   *                 description: Contact number for the booking
   *               companyId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the company providing the service
   *               bookingPrice:
   *                 type: number
   *                 description: Price of the booking
   *               status:
   *                 type: string
   *                 enum: [UPCOMING, ONGOING, COMPLETED, CANCELLED]
   *                 default: UPCOMING
   *                 description: Status of the booking
   *               notes:
   *                 type: object
   *                 description: Additional notes for the booking
   *               cancellationReason:
   *                 type: string
   *                 description: Reason for cancellation if booking is cancelled
   *               services:
   *                 type: array
   *                 description: List of services included in the booking
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
   *                 description: List of areas included in the booking
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
   *         description: The created booking
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Booking'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: BookingController.createBookingController,
    authFunction: isAuth,
    bodyValidation: {
      issueDescription: joi.string().required(),
      attachments: joi.array().items(joi.string()).optional(),
      address: joi.string().required(),
      schedule: joi.date().required(),
      contactNumber: joi.string().required(),
      companyId: joi.string().guid().required(),
      bookingPrice: joi.number().required(),
      status: joi
        .string()
        .valid("UPCOMING", "ONGOING", "COMPLETED", "CANCELLED")
        .optional()
        .default("UPCOMING"),
      notes: joi.object().optional(),
      cancellationReason: joi.string().optional(),
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
   * /booking/update:
   *   put:
   *     summary: Update a booking
   *     tags: [Booking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The booking ID
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
   *                 description: Location address for the booking
   *               schedule:
   *                 type: string
   *                 format: date-time
   *                 description: Scheduled date and time for the booking
   *               contactNumber:
   *                 type: string
   *                 description: Contact number for the booking
   *               companyId:
   *                 type: string
   *                 format: uuid
   *                 description: The ID of the company providing the service
   *               bookingPrice:
   *                 type: number
   *                 description: Price of the booking
   *               status:
   *                 type: string
   *                 enum: [UPCOMING, ONGOING, COMPLETED, CANCELLED]
   *                 description: Status of the booking
   *               notes:
   *                 type: object
   *                 description: Additional notes for the booking
   *               cancellationReason:
   *                 type: string
   *                 description: Reason for cancellation if booking is cancelled
   *               services:
   *                 type: array
   *                 description: List of services included in the booking
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
   *                 description: List of areas included in the booking
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
   *         description: The updated booking
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Booking'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: BookingController.updateBookingController,
    authFunction: isAuth,
    bodyValidation: {
      issueDescription: joi.string().optional(),
      attachments: joi.array().items(joi.string()).optional(),
      address: joi.string().optional(),
      schedule: joi.date().optional(),
      contactNumber: joi.string().optional(),
      companyId: joi.string().guid().optional(),
      bookingPrice: joi.number().optional(),
      status: joi
        .string()
        .valid("UPCOMING", "ONGOING", "COMPLETED", "CANCELLED")
        .optional(),
      notes: joi.object().optional(),
      cancellationReason: joi.string().optional(),
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
   * /booking/delete:
   *   delete:
   *     summary: Delete a booking
   *     tags: [Booking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The booking ID
   *     responses:
   *       200:
   *         description: Booking deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Booking not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: BookingController.deleteBookingController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(bookingMethods);

// Map the route with method query
bookingRouter.route("/booking/:method").all(mappedMethods);

export default bookingRouter;
