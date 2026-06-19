import express from "express";
import chatController from "../../controllers/v1/chat.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/conversations", verifyToken, chatController.createOrGetConversation);
router.get("/conversations", verifyToken, chatController.getConversations);
router.post("/messages", verifyToken, chatController.sendMessage);
router.get("/messages/:conversationId", verifyToken, chatController.getMessages);

export default router;
