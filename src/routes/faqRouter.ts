import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as FaqController from "../controllers/FaqController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import joi from "joi";

const faqRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQ:
 *       type: object
 *       required:
 *         - id
 *         - question
 *         - answer
 *         - inApp
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the FAQ
 *         question:
 *           type: string
 *           description: The frequently asked question
 *         answer:
 *           type: string
 *           description: The answer to the question
 *         inApp:
 *           type: boolean
 *           description: Whether the FAQ is visible in the app
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the FAQ was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the FAQ was last updated
 */

const faqMethods: { [key: string]: MethodInfo } = {
  /**
   * @swagger
   * /faq/get-all:
   *   get:
   *     summary: Get all FAQs
   *     tags: [FAQ]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all FAQs
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/FAQ'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  "get-all": {
    httpMethod: "GET",
    controllerFunction: FaqController.getAllFaqsController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /faq/get-by-id:
   *   get:
   *     summary: Get a FAQ by ID
   *     tags: [FAQ]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The FAQ ID
   *     responses:
   *       200:
   *         description: The FAQ information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FAQ'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   */
  "get-by-id": {
    httpMethod: "GET",
    controllerFunction: FaqController.getFaqByIdController,
    authFunction: isAuth,
  },
  /**
   * @swagger
   * /faq/create:
   *   post:
   *     summary: Create a new FAQ
   *     tags: [FAQ]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - question
   *               - answer
   *             properties:
   *               question:
   *                 type: string
   *                 description: The frequently asked question
   *               answer:
   *                 type: string
   *                 description: The answer to the question
   *               inApp:
   *                 type: boolean
   *                 default: false
   *                 description: Whether the FAQ is visible in the app
   *     responses:
   *       200:
   *         description: The created FAQ
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FAQ'
   *       401:
   *         description: Unauthorized
   *       400:
   *         description: Bad request - validation error
   *       500:
   *         description: Server error
   */
  create: {
    httpMethod: "POST",
    controllerFunction: FaqController.createFaqController,
    authFunction: isAuth,
    bodyValidation: {
      question: joi.string().required(),
      answer: joi.string().required(),
      inApp: joi.boolean().optional().default(false),
    },
  },
  /**
   * @swagger
   * /faq/update:
   *   put:
   *     summary: Update a FAQ
   *     tags: [FAQ]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The FAQ ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               question:
   *                 type: string
   *                 description: The frequently asked question
   *               answer:
   *                 type: string
   *                 description: The answer to the question
   *               inApp:
   *                 type: boolean
   *                 description: Whether the FAQ is visible in the app
   *     responses:
   *       200:
   *         description: The updated FAQ
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FAQ'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   */
  update: {
    httpMethod: "PUT",
    controllerFunction: FaqController.updateFaqController,
    authFunction: isAuth,
    bodyValidation: {
      question: joi.string().optional(),
      answer: joi.string().optional(),
      inApp: joi.boolean().optional(),
    },
  },
  /**
   * @swagger
   * /faq/delete:
   *   delete:
   *     summary: Delete a FAQ
   *     tags: [FAQ]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The FAQ ID
   *     responses:
   *       200:
   *         description: FAQ deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   */
  delete: {
    httpMethod: "DELETE",
    controllerFunction: FaqController.deleteFaqController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(faqMethods);

// Map the route with method query
faqRouter.route("/faq/:method").all(mappedMethods);

export default faqRouter;
