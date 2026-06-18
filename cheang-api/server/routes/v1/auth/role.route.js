import express from "express";
import roleController from "../../../controllers/v1/auth/role.controller.js";
import { verifyToken } from "../../../utils/verifyUser.js";

const router = express.Router();

router.get("/active", roleController.getActive);
router.get("/stats", roleController.getStats);
router.get("/", roleController.getAll);
router.get("/:id", roleController.getById);

// Mutations protected with authentication context
router.post("/", verifyToken, roleController.create);
router.put("/:id", verifyToken, roleController.update);
router.patch("/:id/toggle-active", verifyToken, roleController.toggleActive);
router.delete("/:id/soft", verifyToken, roleController.softDelete);
router.patch("/:id/restore", verifyToken, roleController.restore);
router.delete("/:id/permanent", verifyToken, roleController.permanentDelete);
router.post("/bulk-delete", verifyToken, roleController.bulkDelete);
router.post("/bulk-restore", verifyToken, roleController.bulkRestore);

export default router;
