import express from "express";
import notificationController from "../../controllers/v1/notification.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Retrieve notifications for the logged in user
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, notificationController.getMyNotifications);

/**
 * @swagger
 * /api/v1/notifications/mark-read:
 *   put:
 *     summary: Mark all notifications as read for the logged in user
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/mark-read", verifyToken, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     summary: Soft delete a specific notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized (if trying to delete another user's notification)
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", verifyToken, notificationController.deleteNotification);

export default router;
