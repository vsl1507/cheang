import express from "express";
import transactionController from "../../controllers/v1/transaction.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all billing and financial transactions
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, transactionController.getTransactions);

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Log a new platform transaction
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking
 *               - payer
 *               - payee
 *               - amount
 *               - paymentMethod
 *             properties:
 *               booking:
 *                 type: string
 *                 description: Booking reference ID
 *               payer:
 *                 type: string
 *                 description: Client User ID
 *               payee:
 *                 type: string
 *                 description: Handyman User ID
 *               amount:
 *                 type: number
 *                 example: 75.00
 *               currency:
 *                 type: string
 *                 default: USD
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, ABA, Stripe]
 *                 example: ABA
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed, Failed, Refunded]
 *                 default: Pending
 *     responses:
 *       201:
 *         description: Transaction logged successfully
 *       400:
 *         description: Validation error
 */
router.post("/", verifyToken, transactionController.create);

export default router;
