export const createReviewSchema = (data) => {
  const errors = [];

  if (data.rating !== undefined && (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5)) {
    errors.push("Rating must be a number between 1 and 5");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateReviewSchema = (data) => {
  const errors = [];

  if (data.rating !== undefined && (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5)) {
    errors.push("Rating must be a number between 1 and 5");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
