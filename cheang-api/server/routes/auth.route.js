import express from "express";
import {
  google,
  signin,
  signout,
  signup,
  refreshToken,
  myprofile,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameuser
 *               - email
 *               - password
 *             properties:
 *               nameuser:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
authRouter.post("/signup", signup);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully and cookies set
 *       400:
 *         description: Invalid email or password
 */
authRouter.post("/signin", signin);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate via Google OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameuser
 *               - email
 *             properties:
 *               nameuser:
 *                 type: string
 *               email:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
authRouter.post("/google", google);

/**
 * @swagger
 * /api/auth/signout:
 *   get:
 *     summary: Log out the current user and clear sessions
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
authRouter.get("/signout", signout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Rotate and refresh JSON Web Tokens
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token rotated successfully
 */
authRouter.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/myprofile:
 *   get:
 *     summary: Get profile of current logged in user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile details
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/myprofile", verifyToken, myprofile);

export default authRouter;
