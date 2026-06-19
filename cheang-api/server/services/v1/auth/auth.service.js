import BasicService from "../../basic.service.js";
import User from "../../../models/user.model.js";
import Role from "../../../models/v1/auth/role.model.js";
import Permission from "../../../models/v1/auth/permission.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Review from "../../../models/review.model.js";
import Save from "../../../models/save.model.js";

async function populateUserCommentsAndSaves(userObj) {
  if (!userObj) return null;
  const userId = userObj._id;

  const reviews = await Review.find({ handyman: userId })
    .populate("client", "nameuser avatar")
    .sort({ createdAt: -1 });

  const formattedRatings = reviews.map(r => ({
    _id: r._id,
    userRate: r.client ? r.client._id.toString() : "",
    rating: r.rating
  }));

  const formattedComments = reviews
    .filter(r => r.comment && r.comment.trim() !== "")
    .map(r => ({
      _id: r._id,
      userComment: r.client ? r.client._id.toString() : "",
      userName: r.client ? r.client.nameuser : "",
      userAvatar: r.client ? r.client.avatar : "",
      comment: r.comment,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

  const saves = await Save.find({ userSaver: userId })
    .populate("userSaved", "nameuser avatar");

  const formattedSaves = saves.map(s => ({
    _id: s._id,
    userId: s.userSaved ? s.userSaved._id.toString() : "",
    userName: s.userSaved ? s.userSaved.nameuser : "",
    userAvatar: s.userSaved ? s.userSaved.avatar : "",
    saveSign: s.saveSign,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt
  }));

  userObj.ratings = formattedRatings;
  userObj.comments = formattedComments;
  userObj.saves = formattedSaves;

  return userObj;
}

class AuthService extends BasicService {
  constructor() {
    super(User);
  }

  /**
   * User Signup
   * @param {Object} data - Username, email, password
   * @returns {Object} Service response
   */
  async signup(data) {
    try {
      const lowercasedEmail = data.email.toLowerCase();

      // Check if user already exists
      const existingUser = await this.model.findOne({ email: lowercasedEmail });
      if (existingUser) {
        return {
          success: false,
          error: "Email is already in use",
          code: "DUPLICATE_ERROR",
        };
      }

      // Hash password
      const hashedPassword = bcryptjs.hashSync(data.password, 10);

      // Find default Client role
      const clientRole = await Role.findOne({ name: "Client" });

      const newUserData = {
        nameuser: data.nameuser,
        email: lowercasedEmail,
        password: hashedPassword,
        role: clientRole ? clientRole._id : undefined,
      };

      // Call inherited create (will automatically log activity)
      const result = await this.create(newUserData);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "CREATE_ERROR",
      };
    }
  }

  /**
   * User Signin
   * @param {String} email
   * @param {String} password
   * @returns {Object} Service response with user data and tokens
   */
  async signin(email, password) {
    try {
      const lowercasedEmail = email.toLowerCase();

      // Find user
      const user = await this.model.findOne({ email: lowercasedEmail });
      if (!user) {
        return {
          success: false,
          error: "Email not found!",
          code: "NOT_FOUND",
        };
      }

      // Check password
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return {
          success: false,
          error: "Wrong Password!",
          code: "UNAUTHORIZED",
        };
      }

      // Generate Tokens
      const secret = process.env.JWT_SECRET;
      const refreshSecret = process.env.JWT_REFRESH_SECRET || secret;

      const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

      // Save refresh token to user
      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push(refreshToken);
      if (user.refreshTokens.length > 5) {
        user.refreshTokens.shift();
      }
      await user.save();

      // Log Login Activity manually since login is not a standard service write operation
      await this.logActivity(user._id, "LOGIN", user._id, `User ${user.email} logged in successfully`);

      // Remove password from output
      const userObj = user.toObject();
      const populatedUser = await populateUserCommentsAndSaves(userObj);
      const { password: pass, refreshTokens: rt, ...userWithoutPassword } = populatedUser;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          accessToken,
          refreshToken,
        },
        message: "Logged in successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "INTERNAL_ERROR",
      };
    }
  }

  /**
   * Google Signin/Signup OAuth
   * @param {String} nameuser
   * @param {String} email
   * @param {String} photo
   * @returns {Object} Service response with user data and tokens
   */
  async googleSignIn(nameuser, email, photo) {
    try {
      const lowercasedEmail = email.toLowerCase();
      let user = await this.model.findOne({ email: lowercasedEmail });
      let isNewUser = false;

      if (!user) {
        // Create a new user if not exists
        isNewUser = true;
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);

        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const clientRole = await Role.findOne({ name: "Client" });

        user = new User({
          nameuser,
          email: lowercasedEmail,
          password: hashedPassword,
          avatar: photo,
          role: clientRole ? clientRole._id : undefined,
        });

        await user.save();
        // Log user creation
        await this.logActivity(user._id, "CREATE", user._id, `Created Google user ${user.email}`);
      }

      // Generate Tokens
      const secret = process.env.JWT_SECRET;
      const refreshSecret = process.env.JWT_REFRESH_SECRET || secret;

      const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push(refreshToken);
      if (user.refreshTokens.length > 5) {
        user.refreshTokens.shift();
      }
      await user.save();

      // Log Login Activity
      await this.logActivity(user._id, isNewUser ? "GOOGLE_SIGNUP" : "GOOGLE_LOGIN", user._id, `User ${user.email} authenticated via Google`);

      const userObj = user.toObject();
      const populatedUser = await populateUserCommentsAndSaves(userObj);
      const { password: pass, refreshTokens: rt, ...userWithoutPassword } = populatedUser;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          accessToken,
          refreshToken,
        },
        message: "Google authentication successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "INTERNAL_ERROR",
      };
    }
  }

  /**
   * Refresh Access Token using Refresh Token
   * @param {String} token - Refresh Token
   * @returns {Object} Service response with new tokens
   */
  async refreshToken(token) {
    try {
      if (!token) {
        return {
          success: false,
          error: "Refresh Token is required",
          code: "UNAUTHORIZED",
        };
      }

      const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      let payload;

      try {
        payload = jwt.verify(token, refreshSecret);
      } catch (err) {
        return {
          success: false,
          error: "Invalid or expired refresh token",
          code: "FORBIDDEN",
        };
      }

      // Find user with matching ID and refresh token
      const user = await this.model.findOne({ _id: payload.id, refreshTokens: token });
      if (!user) {
        return {
          success: false,
          error: "User not found or refresh token revoked",
          code: "UNAUTHORIZED",
        };
      }

      // Generate new tokens
      const secret = process.env.JWT_SECRET;
      const newAccessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
      const newRefreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

      // Rotate refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t !== token);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      return {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: "Tokens refreshed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "INTERNAL_ERROR",
      };
    }
  }

  /**
   * Get authenticated user profile
   * @param {String} userId
   * @returns {Object} Service response
   */
  async myprofile(userId) {
    // BasicService getById auto-populates roles & permissions!
    const result = await this.getById(userId);
    if (result.success && result.data) {
      // Remove password from user profile output
      const userObj = result.data.toObject();
      const populatedUser = await populateUserCommentsAndSaves(userObj);
      const { password, refreshToken, ...userWithoutSensitive } = populatedUser;
      return {
        success: true,
        data: userWithoutSensitive,
        message: "User profile retrieved successfully",
      };
    }
    return result;
  }
}

export default AuthService;
