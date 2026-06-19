export const createConversationSchema = (data) => {
  const errors = [];

  if (!data.recipientId || typeof data.recipientId !== "string" || !data.recipientId.trim()) {
    errors.push("Recipient ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const createMessageSchema = (data) => {
  const errors = [];

  if (!data.conversationId || typeof data.conversationId !== "string" || !data.conversationId.trim()) {
    errors.push("Conversation ID is required");
  }
  if (!data.text || typeof data.text !== "string" || !data.text.trim()) {
    errors.push("Message text is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
