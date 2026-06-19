import express from "express";
import chatController from "../controllers/v1/chat.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const chatRouter = express.Router();

chatRouter.post("/conversations", verifyToken, chatController.createOrGetConversation);
chatRouter.get("/conversations", verifyToken, chatController.getConversations);
chatRouter.post("/messages", verifyToken, chatController.sendMessage);
chatRouter.get("/messages/:conversationId", verifyToken, chatController.getMessages);

export default chatRouter;
