export class ConversationMapper {
  static toDTO(conversation) {
    if (!conversation) return null;
    const conversationObj = conversation.toObject ? conversation.toObject() : { ...conversation };
    return {
      id: conversationObj._id || conversationObj.id,
      participants: conversationObj.participants,
      lastMessage: conversationObj.lastMessage,
      createdAt: conversationObj.createdAt,
      updatedAt: conversationObj.updatedAt,
    };
  }

  static toDTOs(conversations) {
    if (!conversations) return [];
    return conversations.map(this.toDTO);
  }
}

export class MessageMapper {
  static toDTO(message) {
    if (!message) return null;
    const messageObj = message.toObject ? message.toObject() : { ...message };
    return {
      id: messageObj._id || messageObj.id,
      conversationId: messageObj.conversationId,
      sender: messageObj.sender,
      text: messageObj.text,
      isRead: messageObj.isRead,
      createdAt: messageObj.createdAt,
      updatedAt: messageObj.updatedAt,
    };
  }

  static toDTOs(messages) {
    if (!messages) return [];
    return messages.map(this.toDTO);
  }
}
