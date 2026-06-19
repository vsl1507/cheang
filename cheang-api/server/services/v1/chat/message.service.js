import BasicService from "../../basic.service.js";
import Message from "../../../models/v1/chat/message.model.js";
import Conversation from "../../../models/v1/chat/conversation.model.js";

class MessageService extends BasicService {
  constructor() {
    super(Message);
  }

  async sendMessage(conversationId, senderId, text) {
    try {
      const message = await this.model.create({
        conversationId,
        sender: senderId,
        text,
      });

      // Update last message in conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        $set: { lastMessage: text },
      });

      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMessagesForConversation(conversationId) {
    try {
      const messages = await this.model.find({ conversationId }).sort({ createdAt: 1 });
      return { success: true, data: messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default MessageService;
