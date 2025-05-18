import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as ReviewController from "../controllers/ReviewController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const reviewRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - id
 *         - rating
 *         - review
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the review
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         review:
 *           type: string
 *           description: Text content of the review
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: ID of the client who submitted the review
 *         client:
 *           type: object
 *           description: Information about the client who submitted the review
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *             profilePicture:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the review was last updated
 */

const reviewMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /review/get-all:
   *   get:
   *     summary: Get all reviews
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all reviews
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Review'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: ReviewController.getAllReviewsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /review/get-by-id:
   *   get:
   *     summary: Get a review by ID
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The review ID
   *     responses:
   *       200:
   *         description: The review information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Review'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: ReviewController.getReviewByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /review/create:
   *   post:
   *     summary: Create a new review
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - rating
   *               - review
   *             properties:
   *               rating:
   *                 type: number
   *                 minimum: 1
   *                 maximum: 5
   *                 description: Rating from 1 to 5
   *               review:
   *                 type: string
   *                 description: Text content of the review
   *               clientId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the client who is submitting the review
   *     responses:
   *       200:
   *         description: The created review
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Review'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: ReviewController.createReviewController,
    authFunction: isAuth,
    bodyValidation: {
      rating: joi.number().min(1).max(5).required(),
      review: joi.string().required(),
      clientId: joi.string().guid().optional(),
    },
  },
  /**
   * @swagger
   * /review/update:
   *   put:
   *     summary: Update a review
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The review ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rating:
   *                 type: number
   *                 minimum: 1
   *                 maximum: 5
   *                 description: Rating from 1 to 5
   *               review:
   *                 type: string
   *                 description: Text content of the review
   *     responses:
   *       200:
   *         description: The updated review
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Review'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: ReviewController.updateReviewController,
    authFunction: isAuth,
    bodyValidation: {
      rating: joi.number().min(1).max(5).optional(),
      review: joi.string().optional(),
    },
  },
  /**
   * @swagger
   * /review/delete:
   *   delete:
   *     summary: Delete a review
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The review ID
   *     responses:
   *       200:
   *         description: Review deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: ReviewController.deleteReviewController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(reviewMethods);

// Map the route with method query
reviewRouter.route("/review/:method").all(mappedMethods);

export default reviewRouter;
