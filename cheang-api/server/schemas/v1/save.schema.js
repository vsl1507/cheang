export const createSaveSchema = (data) => {
  const errors = [];

  if (!data.userSaver || typeof data.userSaver !== "string") {
    errors.push("userSaver ID is required");
  }
  if (!data.userSaved || typeof data.userSaved !== "string") {
    errors.push("userSaved ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateSaveSchema = (data) => {
  const errors = [];
  return {
    isValid: errors.length === 0,
    errors,
  };
};
