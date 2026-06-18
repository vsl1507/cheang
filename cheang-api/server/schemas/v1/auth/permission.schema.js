export const createPermissionSchema = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Permission name is required and must be a string");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const updatePermissionSchema = (data) => {
  const errors = [];
  if (data.name !== undefined && (typeof data.name !== "string" || !data.name.trim())) {
    errors.push("Permission name must be a non-empty string");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};
