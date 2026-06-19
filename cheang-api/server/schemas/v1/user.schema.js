export const createUserSchema = (data) => {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.nameuser || typeof data.nameuser !== "string" || !data.nameuser.trim()) {
    errors.push("Username is required");
  }
  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!emailPattern.test(data.email.trim())) {
    errors.push("Invalid email format");
  }
  if (!data.password || typeof data.password !== "string" || !data.password.trim()) {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const updateUserSchema = (data) => {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (data.email !== undefined) {
    if (typeof data.email !== "string" || !data.email.trim()) {
      errors.push("Email must be a valid string");
    } else if (!emailPattern.test(data.email.trim())) {
      errors.push("Invalid email format");
    }
  }

  if (data.password !== undefined) {
    if (typeof data.password !== "string" || !data.password.trim()) {
      errors.push("Password must be a valid string");
    } else if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
  }

  if (data.nameuser !== undefined && (typeof data.nameuser !== "string" || !data.nameuser.trim())) {
    errors.push("Username must be a valid string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
