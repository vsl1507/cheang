export const createSignupSchema = (data) => {
  const errors = [];
  const validNameUserPattern = /^[a-zA-Z0-9\s]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.nameuser || typeof data.nameuser !== "string" || !data.nameuser.trim()) {
    errors.push("Username is required and must be a string");
  } else if (!validNameUserPattern.test(data.nameuser)) {
    errors.push("Username can only contain letters, numbers, and spaces");
  }

  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required and must be a string");
  } else if (!emailPattern.test(data.email.trim())) {
    errors.push("Invalid email format");
  }

  if (!data.password || typeof data.password !== "string" || !data.password.trim()) {
    errors.push("Password is required and must be a string");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const createSigninSchema = (data) => {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!emailPattern.test(data.email.trim())) {
    errors.push("Invalid email format");
  }

  if (!data.password || typeof data.password !== "string" || !data.password.trim()) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
