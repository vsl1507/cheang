import express from "express";
import saveController from "../../controllers/v1/save.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/saves:
 *   get:
 *     summary: Retrieve all saved bookmark entries
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of saved bookmark logs retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, saveController.getAll);

export default router;
