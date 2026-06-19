import express from "express";
import supportMessageController from "../../controllers/v1/supportMessage.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/support-messages:
 *   post:
 *     summary: Submit a new support or contact message
 *     tags: [SupportMessages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - topic
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               topic:
 *                 type: string
 *                 example: "Payment Issue"
 *               message:
 *                 type: string
 *                 example: "My ABA transaction failed but booking price was charged."
 *     responses:
 *       201:
 *         description: Support message logged successfully
 *       400:
 *         description: Validation error
 */
router.post("/", supportMessageController.create);

/**
 * @swagger
 * /api/v1/support-messages:
 *   get:
 *     summary: Retrieve list of all support messages
 *     tags: [SupportMessages]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Support messages list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, supportMessageController.getSupportMessages);

/**
 * @swagger
 * /api/v1/support-messages/{id}:
 *   put:
 *     summary: Update support message status
 *     tags: [SupportMessages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Support Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, Pending, Resolved]
 *                 example: Resolved
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Support message not found
 */
router.put("/:id", verifyToken, supportMessageController.updateStatus);

/**
 * @swagger
 * /api/v1/support-messages/{id}:
 *   delete:
 *     summary: Soft delete a support message
 *     tags: [SupportMessages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Support Message ID
 *     responses:
 *       200:
 *         description: Support message soft deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Support message not found
 */
router.delete("/:id", verifyToken, supportMessageController.softDelete);

export default router;

