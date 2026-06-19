export const createBookingSchema = (data) => {
  const errors = [];

  if (!data.client || typeof data.client !== "string") {
    errors.push("Client ID is required");
  }
  if (!data.handyman || typeof data.handyman !== "string") {
    errors.push("Handyman ID is required");
  }
  if (!data.serviceName || typeof data.serviceName !== "string" || !data.serviceName.trim()) {
    errors.push("Service name is required");
  }
  if (data.price === undefined || typeof data.price !== "number" || data.price < 0) {
    errors.push("Price is required and must be a non-negative number");
  }
  if (!data.bookingDate || isNaN(Date.parse(data.bookingDate))) {
    errors.push("Valid booking date is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateBookingSchema = (data) => {
  const errors = [];

  if (data.status !== undefined) {
    const validStatuses = ["Pending", "Accepted", "Completed", "Cancelled"];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
