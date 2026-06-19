import BasicController from "../basic.controller.js";
import ConversationService from "../../services/v1/chat/conversation.service.js";
import MessageService from "../../services/v1/chat/message.service.js";
import { createConversationSchema, createMessageSchema } from "../../schemas/v1/chat.schema.js";
import { ConversationMapper, MessageMapper } from "../../mappers/v1/chat.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const conversationService = new ConversationService();
const messageService = new MessageService();

class ChatController extends BasicController {
  constructor() {
    super(conversationService);
  }

  createOrGetConversation = async (req, res) => {
    const { isValid, errors } = createConversationSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }

    try {
      const senderId = req.user?.id || req.user?._id;
      const { recipientId } = req.body;

      const result = await conversationService.createOrGet(senderId, recipientId);
      if (result.success) {
        result.data = ConversationMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getConversations = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await conversationService.getConversationsForUser(userId);
      if (result.success) {
        result.data = ConversationMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  sendMessage = async (req, res) => {
    const { isValid, errors } = createMessageSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }

    try {
      const senderId = req.user?.id || req.user?._id;
      const { conversationId, text } = req.body;

      const result = await messageService.sendMessage(conversationId, senderId, text);
      if (result.success) {
        result.data = MessageMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getMessages = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.id || req.user?._id;

      // Verify user is a participant
      const convoResult = await conversationService.getById(conversationId);
      if (!convoResult.success) {
        return ResponseUtil.handleServiceResult(res, convoResult);
      }

      const isParticipant = convoResult.data.participants.some(
        (p) => (p._id || p).toString() === userId.toString()
      );

      if (!isParticipant) {
        return ResponseUtil.unauthorized(res, "You are not authorized to view these messages.");
      }

      const result = await messageService.getMessagesForConversation(conversationId);
      if (result.success) {
        result.data = MessageMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new ChatController();
