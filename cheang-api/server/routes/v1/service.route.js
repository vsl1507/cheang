import express from "express";
import serviceController from "../../controllers/v1/service.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/services/create:
 *   post:
 *     summary: Create a new service listing
 *     tags: [Services]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - userRef
 *             properties:
 *               name:
 *                 type: string
 *                 description: Service name
 *                 example: "House Cleaning"
 *               description:
 *                 type: string
 *                 description: Detailed description of service
 *                 example: "Deep cleaning for apartments and residential homes."
 *               price:
 *                 type: number
 *                 description: Flat or hourly price
 *                 example: 35.00
 *               userRef:
 *                 type: string
 *                 description: Handyman/User reference ID
 *                 example: "60b8d2f5f1d2b80015c92842"
 *               image:
 *                 type: string
 *                 description: URL to service listing image
 *                 example: "https://example.com/cleaning.jpg"
 *     responses:
 *       201:
 *         description: Service listing created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/create", verifyToken, serviceController.create);

/**
 * @swagger
 * /api/v1/services/delete/{id}:
 *   delete:
 *     summary: Delete a service listing by ID
 *     tags: [Services]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service listing ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
router.delete("/delete/:id", verifyToken, serviceController.delete);

/**
 * @swagger
 * /api/v1/services/update/{id}:
 *   post:
 *     summary: Update an existing service listing by ID
 *     tags: [Services]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Cleaning Service"
 *               description:
 *                 type: string
 *                 example: "Updated deep cleaning details..."
 *               price:
 *                 type: number
 *                 example: 45.00
 *               image:
 *                 type: string
 *                 example: "https://example.com/premium-cleaning.jpg"
 *     responses:
 *       200:
 *         description: Service listing updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
router.post("/update/:id", verifyToken, serviceController.update);

/**
 * @swagger
 * /api/v1/services/get/{id}:
 *   get:
 *     summary: Retrieve a service listing by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service listing ID
 *     responses:
 *       200:
 *         description: Service listing details retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get("/get/:id", serviceController.getById);

/**
 * @swagger
 * /api/v1/services/user/{id}:
 *   get:
 *     summary: Get all service listings for a specific user ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (Handyman ID)
 *     responses:
 *       200:
 *         description: List of user services retrieved successfully
 */
router.get("/user/:id", serviceController.getServiceUser);

export default router;

