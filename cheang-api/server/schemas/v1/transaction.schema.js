export const createTransactionSchema = (data) => {
  const errors = [];

  if (!data.booking || typeof data.booking !== "string") {
    errors.push("Booking ID is required");
  }
  if (!data.payer || typeof data.payer !== "string") {
    errors.push("Payer ID is required");
  }
  if (!data.payee || typeof data.payee !== "string") {
    errors.push("Payee ID is required");
  }
  if (data.amount === undefined || typeof data.amount !== "number" || data.amount <= 0) {
    errors.push("Amount is required and must be a positive number");
  }
  if (!data.paymentMethod || !["Cash", "ABA", "Stripe"].includes(data.paymentMethod)) {
    errors.push("Payment method must be one of: Cash, ABA, Stripe");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateTransactionSchema = (data) => {
  const errors = [];

  if (data.status !== undefined) {
    const validStatuses = ["Pending", "Completed", "Failed", "Refunded"];
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
