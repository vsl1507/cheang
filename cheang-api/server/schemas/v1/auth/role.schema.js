export const createRoleSchema = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Role name is required and must be a string");
  }
  if (data.permissions && !Array.isArray(data.permissions)) {
    errors.push("Permissions must be an array of IDs");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const updateRoleSchema = (data) => {
  const errors = [];
  if (data.name !== undefined && (typeof data.name !== "string" || !data.name.trim())) {
    errors.push("Role name must be a non-empty string");
  }
  if (data.permissions !== undefined && !Array.isArray(data.permissions)) {
    errors.push("Permissions must be an array of IDs");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};
