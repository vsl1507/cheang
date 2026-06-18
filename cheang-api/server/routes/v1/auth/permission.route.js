import express from "express";
import permissionController from "../../../controllers/v1/auth/permission.controller.js";
import { verifyToken } from "../../../utils/verifyUser.js";

const router = express.Router();

router.get("/active", permissionController.getActive);
router.get("/stats", permissionController.getStats);
router.get("/", permissionController.getAll);
router.get("/:id", permissionController.getById);

// Mutations protected with authentication context
router.post("/", verifyToken, permissionController.create);
router.put("/:id", verifyToken, permissionController.update);
router.patch("/:id/toggle-active", verifyToken, permissionController.toggleActive);
router.delete("/:id/soft", verifyToken, permissionController.softDelete);
router.patch("/:id/restore", verifyToken, permissionController.restore);
router.delete("/:id/permanent", verifyToken, permissionController.permanentDelete);
router.post("/bulk-delete", verifyToken, permissionController.bulkDelete);
router.post("/bulk-restore", verifyToken, permissionController.bulkRestore);

export default router;
