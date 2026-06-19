export const createSupportMessageSchema = (data) => {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Name is required");
  }
  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!emailPattern.test(data.email.trim())) {
    errors.push("Invalid email format");
  }
  if (!data.topic || typeof data.topic !== "string" || !data.topic.trim()) {
    errors.push("Topic is required");
  }
  if (!data.message || typeof data.message !== "string" || !data.message.trim()) {
    errors.push("Message is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateSupportMessageSchema = (data) => {
  const errors = [];

  if (data.status !== undefined) {
    const validStatuses = ["New", "Pending", "Resolved"];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
