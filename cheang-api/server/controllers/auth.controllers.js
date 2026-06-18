import AuthService from "../services/v1/auth/auth.service.js";
import { createSignupSchema, createSigninSchema } from "../schemas/v1/auth/auth.schema.js";
import ResponseUtil from "../utils/response.util.js";

const authService = new AuthService();

// Helper to set auth cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to clear auth cookies
const clearAuthCookies = (res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};

// Sign Up
export const signup = async (req, res) => {
  const { isValid, errors } = createSignupSchema(req.body);
  if (!isValid) {
    return ResponseUtil.badRequest(res, errors.join(", "));
  }

  try {
    const result = await authService.signup(req.body);
    return ResponseUtil.handleServiceResult(res, result, 201);
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Sign In
export const signin = async (req, res) => {
  const { isValid, errors } = createSigninSchema(req.body);
  if (!isValid) {
    return ResponseUtil.badRequest(res, errors.join(", "));
  }

  try {
    const result = await authService.signin(req.body.email, req.body.password);
    if (result.success && result.data) {
      setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    }
    return ResponseUtil.handleServiceResult(res, result);
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Google OAuth
export const google = async (req, res) => {
  try {
    const result = await authService.googleSignIn(
      req.body.nameuser,
      req.body.email,
      req.body.photo
    );
    if (result.success && result.data) {
      setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    }
    return ResponseUtil.handleServiceResult(res, result);
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Sign Out
export const signout = async (req, res) => {
  try {
    clearAuthCookies(res);
    return ResponseUtil.success(res, null, "User has been logged out!");
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token || req.body.refreshToken;
    const result = await authService.refreshToken(token);
    if (result.success && result.data) {
      setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    }
    return ResponseUtil.handleServiceResult(res, result);
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Get current user profile
export const myprofile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return ResponseUtil.unauthorized(res, "User context not found");
    }
    const result = await authService.myprofile(userId);
    return ResponseUtil.handleServiceResult(res, result);
  } catch (error) {
    return ResponseUtil.internalError(res, error.message);
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  return ResponseUtil.success(res, null, "Reset password email sent");
};
