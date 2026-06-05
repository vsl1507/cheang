import express from "express";
import categoryController from "../../../controllers/v1/auth/category.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js"; // Uncomment when you have auth

const router = express.Router();

// Public routes (or add authentication as needed)
/**
 * @route   GET /api/categories/active
 * @desc    Get all active categories
 * @access  Public
 */
router.get("/active", categoryController.getActive);

/**
 * @route   GET /api/categories/stats
 * @desc    Get category statistics
 * @access  Private/Admin
 */
router.get("/stats", categoryController.getStats);

/**
 * @route   GET /api/categories
 * @desc    Get all categories with pagination
 * @access  Private
 * @query   page, limit, sort, search, status, includeDeleted
 */
router.get("/", categoryController.getAll);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get("/:id", categoryController.getById);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private
 */
router.post("/", categoryController.create);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private
 */
router.put("/:id", categoryController.update);

/**
 * @route   PATCH /api/categories/:id/toggle-active
 * @desc    Toggle category active status
 * @access  Private
 */
router.patch("/:id/toggle-active", categoryController.toggleActive);

/**
 * @route   DELETE /api/categories/:id/soft
 * @desc    Soft delete category
 * @access  Private
 */
router.delete("/:id/soft", categoryController.softDelete);

/**
 * @route   PATCH /api/categories/:id/restore
 * @desc    Restore soft deleted category
 * @access  Private
 */
router.patch("/:id/restore", categoryController.restore);

/**
 * @route   DELETE /api/categories/:id/permanent
 * @desc    Permanently delete category
 * @access  Private/Admin
 */
router.delete("/:id/permanent", categoryController.permanentDelete);

/**
 * @route   POST /api/categories/bulk-delete
 * @desc    Bulk soft delete categories
 * @access  Private
 */
router.post("/bulk-delete", categoryController.bulkDelete);

/**
 * @route   POST /api/categories/bulk-restore
 * @desc    Bulk restore categories
 * @access  Private
 */
router.post("/bulk-restore", categoryController.bulkRestore);

export default router;
