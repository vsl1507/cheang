export const createCategorySchema = (data) => {
  const errors = [];

  if (!data.nameEn || typeof data.nameEn !== "string" || !data.nameEn.trim()) {
    errors.push("English name is required and must be a string");
  }
  if (!data.nameKh || typeof data.nameKh !== "string" || !data.nameKh.trim()) {
    errors.push("Khmer name is required and must be a string");
  }
  if (!data.nameZh || typeof data.nameZh !== "string" || !data.nameZh.trim()) {
    errors.push("Chinese name is required and must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateCategorySchema = (data) => {
  const errors = [];

  if (data.nameEn !== undefined && (typeof data.nameEn !== "string" || !data.nameEn.trim())) {
    errors.push("English name must be a non-empty string");
  }
  if (data.nameKh !== undefined && (typeof data.nameKh !== "string" || !data.nameKh.trim())) {
    errors.push("Khmer name must be a non-empty string");
  }
  if (data.nameZh !== undefined && (typeof data.nameZh !== "string" || !data.nameZh.trim())) {
    errors.push("Chinese name must be a non-empty string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
