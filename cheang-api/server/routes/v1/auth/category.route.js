import express from "express";
import categoryController from "../../../controllers/v1/auth/category.controller.js";
import { verifyToken } from "../../../utils/verifyUser.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/categories/active:
 *   get:
 *     summary: Retrieve list of all active categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Active categories list retrieved successfully
 */
router.get("/active", categoryController.getActive);

/**
 * @swagger
 * /api/v1/categories/stats:
 *   get:
 *     summary: Get category statistics reports
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistics report (total, active, inactive, deleted counts)
 */
router.get("/stats", verifyToken, categoryController.getStats);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories with pagination, search, and status filters
 *     tags: [Categories]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by nameEn, nameKh, nameZh, description
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get("/", categoryController.getAll);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get category details by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details object
 *       404:
 *         description: Category not found
 */
router.get("/:id", categoryController.getById);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameEn
 *               - nameKh
 *               - nameZh
 *             properties:
 *               nameEn:
 *                 type: string
 *                 example: Plumbing
 *               nameKh:
 *                 type: string
 *                 example: ជួសជុលទុយោទឹក
 *               nameZh:
 *                 type: string
 *                 example: 水管维修
 *               description:
 *                 type: string
 *                 example: Plumbing repair services
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", verifyToken, categoryController.create);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
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
 *               nameEn:
 *                 type: string
 *               nameKh:
 *                 type: string
 *               nameZh:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", verifyToken, categoryController.update);

/**
 * @swagger
 * /api/v1/categories/{id}/toggle-active:
 *   patch:
 *     summary: Toggle active status of a category
 *     tags: [Categories]
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
 *         description: Category active status toggled successfully
 */
router.patch("/:id/toggle-active", verifyToken, categoryController.toggleActive);

/**
 * @swagger
 * /api/v1/categories/{id}/soft:
 *   delete:
 *     summary: Soft delete a category
 *     tags: [Categories]
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
 *         description: Category soft deleted successfully
 */
router.delete("/:id/soft", verifyToken, categoryController.softDelete);

/**
 * @swagger
 * /api/v1/categories/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted category
 *     tags: [Categories]
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
 *         description: Category restored successfully
 */
router.patch("/:id/restore", verifyToken, categoryController.restore);

/**
 * @swagger
 * /api/v1/categories/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a category
 *     tags: [Categories]
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
 *         description: Category permanently deleted
 */
router.delete("/:id/permanent", verifyToken, categoryController.permanentDelete);

/**
 * @swagger
 * /api/v1/categories/bulk-delete:
 *   post:
 *     summary: Bulk soft delete categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Categories bulk soft deleted
 */
router.post("/bulk-delete", verifyToken, categoryController.bulkDelete);

/**
 * @swagger
 * /api/v1/categories/bulk-restore:
 *   post:
 *     summary: Bulk restore soft-deleted categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Categories bulk restored
 */
router.post("/bulk-restore", verifyToken, categoryController.bulkRestore);

export default router;
