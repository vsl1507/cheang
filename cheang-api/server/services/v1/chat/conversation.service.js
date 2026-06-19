import BasicService from "../../basic.service.js";
import Conversation from "../../../models/v1/chat/conversation.model.js";

class ConversationService extends BasicService {
  constructor() {
    super(Conversation);
  }

  async createOrGet(senderId, recipientId) {
    try {
      let conversation = await this.model.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (!conversation) {
        conversation = await this.model.create({
          participants: [senderId, recipientId],
        });
        // Populate participants
        conversation = await this.model.findById(conversation._id);
      }

      return { success: true, data: conversation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getConversationsForUser(userId) {
    try {
      const conversations = await this.model.find({
        participants: userId,
      }).sort({ updatedAt: -1 });

      return { success: true, data: conversations };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default ConversationService;
