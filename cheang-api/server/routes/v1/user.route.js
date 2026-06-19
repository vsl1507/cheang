import express from "express";
import userController from "../../controllers/v1/user.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/getalluser:
 *   get:
 *     summary: Retrieve all professional users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of professional users retrieved successfully
 */
router.get("/getalluser", userController.getAllUser);

/**
 * @swagger
 * /api/v1/users/getalluserac:
 *   get:
 *     summary: Retrieve all professionals excluding current user context
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of other professional users
 *       401:
 *         description: Unauthorized
 */
router.get("/getalluserac", verifyToken, userController.getAllUserAc);

/**
 * @swagger
 * /api/v1/users/getuser/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details populated with comments and bookmarks
 *       404:
 *         description: User not found
 */
router.get("/getuser/:id", verifyToken, userController.getUser);

/**
 * @swagger
 * /api/v1/users/getuserno/{id}:
 *   get:
 *     summary: Get user details by ID without auth token requirement
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details populated with comments and bookmarks
 *       404:
 *         description: User not found
 */
router.get("/getuserno/:id", userController.getUser);

/**
 * @swagger
 * /api/v1/users/update/{id}:
 *   post:
 *     summary: Update profile details for a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameuser:
 *                 type: string
 *               email:
 *                 type: string
 *               brandName:
 *                 type: string
 *               phone:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.post("/update/:id", verifyToken, userController.update);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/delete/:id", verifyToken, userController.delete);

/**
 * @swagger
 * /api/v1/users/rating/{id}:
 *   post:
 *     summary: Submit a star rating for a professional handyman
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Handyman ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Star rating applied successfully
 */
router.post("/rating/:id", verifyToken, userController.ratingUser);

/**
 * @swagger
 * /api/v1/users/comment/{id}:
 *   post:
 *     summary: Add or edit a text comment for a handyman
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Handyman ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Excellent handyman, fast service!
 *     responses:
 *       200:
 *         description: Comment submitted successfully
 */
router.post("/comment/:id", verifyToken, userController.commentUser);

/**
 * @swagger
 * /api/v1/users/deletecomment/{commentId}:
 *   delete:
 *     summary: Remove comments left on a handyman
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: string
 *                 description: Handyman User ID
 *     responses:
 *       200:
 *         description: Comment removed
 */
router.delete("/deletecomment/:commentId", verifyToken, userController.deleteCommentUser);

/**
 * @swagger
 * /api/v1/users/save/{userId}:
 *   post:
 *     summary: Toggle saving/bookmarking a handyman profile
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Handyman ID to bookmark/save
 *     responses:
 *       200:
 *         description: Save bookmark status toggled successfully
 */
router.post("/save/:userId", verifyToken, userController.saveUser);

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     summary: Search professional users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *       - in: query
 *         name: locations
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results list
 */
router.get("/search", verifyToken, userController.searchUsers);

/**
 * @swagger
 * /api/v1/users/live-search:
 *   get:
 *     summary: Filter professionals interactively
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: mainService
 *         schema:
 *           type: string
 *       - in: query
 *         name: subService
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered list of professionals
 */
router.get("/live-search", userController.liveSearch);

export default router;
