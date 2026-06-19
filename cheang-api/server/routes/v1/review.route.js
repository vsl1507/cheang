import express from "express";
import reviewController from "../../controllers/v1/review.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.get("/comments", verifyToken, reviewController.getAllComments);
router.delete("/comments/:userId/:commentId", verifyToken, reviewController.deleteCommentByAdmin);

export default router;
