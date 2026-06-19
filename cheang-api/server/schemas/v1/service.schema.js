export const createServiceSchema = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Service name is required");
  }
  if (!data.description || typeof data.description !== "string" || !data.description.trim()) {
    errors.push("Service description is required");
  }
  if (data.price === undefined || data.price === null || typeof data.price !== "number" || data.price < 0) {
    errors.push("Price is required and must be a non-negative number");
  }
  if (!data.userRef || typeof data.userRef !== "string" || !data.userRef.trim()) {
    errors.push("User reference (userRef) is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateServiceSchema = (data) => {
  const errors = [];

  if (data.name !== undefined && (typeof data.name !== "string" || !data.name.trim())) {
    errors.push("Service name must be a non-empty string");
  }
  if (data.description !== undefined && (typeof data.description !== "string" || !data.description.trim())) {
    errors.push("Service description must be a non-empty string");
  }
  if (data.price !== undefined && (typeof data.price !== "number" || data.price < 0)) {
    errors.push("Price must be a non-negative number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
