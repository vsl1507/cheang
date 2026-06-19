import express from "express";
import bookingController from "../../controllers/v1/booking.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - handyman
 *               - serviceName
 *               - price
 *               - bookingDate
 *             properties:
 *               client:
 *                 type: string
 *                 description: Client User ID
 *               handyman:
 *                 type: string
 *                 description: Handyman User ID
 *               serviceName:
 *                 type: string
 *                 description: Name of the service being booked
 *               price:
 *                 type: number
 *                 example: 50.00
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-25T10:00:00.000Z"
 *               address:
 *                 type: string
 *                 default: "Phnom Penh, Cambodia"
 *                 example: "Phnom Penh, Cambodia"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", verifyToken, bookingController.create);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   put:
 *     summary: Update an existing booking's status
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Accepted, Completed, Cancelled]
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put("/:id", verifyToken, bookingController.update);

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, bookingController.getBookings);

export default router;

