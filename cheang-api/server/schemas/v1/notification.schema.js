export const createNotificationSchema = (data) => {
  const errors = [];

  if (!data.recipient || typeof data.recipient !== "string") {
    errors.push("Recipient ID is required");
  }
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push("Title is required");
  }
  if (!data.message || typeof data.message !== "string" || !data.message.trim()) {
    errors.push("Message is required");
  }
  if (data.type && !["info", "success", "warning", "error"].includes(data.type)) {
    errors.push("Type must be one of: info, success, warning, error");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateNotificationSchema = (data) => {
  const errors = [];

  if (data.isRead !== undefined && typeof data.isRead !== "boolean") {
    errors.push("isRead must be a boolean value");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
