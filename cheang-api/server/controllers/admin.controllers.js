import UserService from "../services/v1/user.service.js";
import BookingService from "../services/v1/booking.service.js";
import ReviewService from "../services/v1/review.service.js";
import SupportMessageService from "../services/v1/supportMessage.service.js";
import TransactionService from "../services/v1/transaction.service.js";
import ActivityLog from "../models/v1/activityLog.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

const userService = new UserService();
const bookingService = new BookingService();
const reviewService = new ReviewService();
const supportMessageService = new SupportMessageService();
const transactionService = new TransactionService();

// Get pending handyman requests
export const usersReq = async (req, res, next) => {
  try {
    const result = await userService.getAll({ Request: true }, { limit: 100 });
    if (result.success) {
      return res.status(200).json(result.data.items);
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Toggle admin role for a user
export const toggleAdminRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own admin role." });
    }
    const userRes = await userService.getById(userId);
    if (!userRes.success) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user = userRes.data;
    user.admin = !user.admin;
    await user.save();
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Delete any user account
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
    }
    const result = await userService.permanentDelete(userId, req.user.id);
    if (result.success) {
      return res.status(200).json({ success: true, message: "User has been deleted successfully." });
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookingsPopulated();
    if (result.success) {
      return res.status(200).json(result.data);
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Get all comments from all professionals
export const getAllComments = async (req, res, next) => {
  try {
    const result = await reviewService.getAllCommentsPopulated();
    if (result.success) {
      const comments = result.data.map((review) => {
        const commenter = review.client || {};
        const handyman = review.handyman || {};
        
        return {
          commentId: review._id,
          commentText: review.comment,
          rating: review.rating,
          createdAt: review.createdAt,
          userName: commenter.nameuser || "Anonymous",
          userAvatar: commenter.avatar,
          handymanId: handyman._id,
          handymanName: handyman.nameuser || "Anonymous",
          handymanBrand: handyman.brandName || "",
        };
      });
      return res.status(200).json(comments);
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteCommentByAdmin = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const result = await reviewService.permanentDelete(commentId, req.user ? req.user.id : null);
    if (result.success) {
      return res.status(200).json({ success: true, message: "Comment deleted successfully." });
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Get all activity logs
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({})
      .populate("userId", "nameuser email avatar")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// Get all support messages
export const getSupportMessages = async (req, res, next) => {
  try {
    const result = await supportMessageService.getAllSorted();
    if (result.success) {
      return res.status(200).json(result.data);
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};

// Update support message status
export const updateSupportMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["New", "Pending", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }
    const result = await supportMessageService.update(id, { status }, req.user ? req.user.id : null);
    if (result.success) {
      return res.status(200).json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: "Support ticket not found." });
  } catch (error) {
    next(error);
  }
};

// Delete support message
export const deleteSupportMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await supportMessageService.softDelete(id, req.user ? req.user.id : null);
    if (result.success) {
      return res.status(200).json({ success: true, message: "Support ticket deleted successfully." });
    }
    return res.status(404).json({ success: false, message: "Support ticket not found." });
  } catch (error) {
    next(error);
  }
};

// Edit user by admin
export const editUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nameuser, email, brandName, phone, province, city, mainService, subService, userPro } = req.body;

    if (email) {
      const existingUserRes = await userService.getOne({ email, _id: { $ne: id } });
      if (existingUserRes.success) {
        return res.status(400).json({ success: false, message: "Email is already in use by another account." });
      }
    }

    const result = await userService.update(
      id,
      { nameuser, email, brandName, phone, province, city, mainService, subService, userPro },
      req.user ? req.user.id : null
    );

    if (result.success) {
      const { password, ...rest } = result.data.toObject ? result.data.toObject() : result.data;
      return res.status(200).json({ success: true, user: rest });
    }
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    next(error);
  }
};

// Reset user password by admin
export const resetUserPasswordByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const saltRounds = 10;
    const hashedPassword = bcryptjs.hashSync(newPassword, saltRounds);

    const result = await userService.update(id, { password: hashedPassword }, req.user ? req.user.id : null);
    if (result.success) {
      return res.status(200).json({ success: true, message: "Password reset successfully." });
    }
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    next(error);
  }
};

// Get all financial transactions
export const getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getAllTransactionsPopulated();
    if (result.success) {
      return res.status(200).json(result.data);
    }
    return next(errorHandler(500, result.error));
  } catch (error) {
    next(error);
  }
};
