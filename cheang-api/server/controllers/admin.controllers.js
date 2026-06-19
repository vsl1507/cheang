import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import ActivityLog from "../models/v1/activityLog.model.js";
import SupportMessage from "../models/supportMessage.model.js";
import bcryptjs from "bcryptjs";

// Get pending handyman requests
export const usersReq = async (req, res, next) => {
  try {
    const users = await User.find({
      Request: true,
    });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Toggle admin role for a user
export const toggleAdminRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Prevent self role modification
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own admin role." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
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
    // Prevent self deletion
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: "User has been deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate("client", "nameuser email avatar")
      .populate("handyman", "nameuser email avatar brandName")
      .sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get all comments from all professionals
export const getAllComments = async (req, res, next) => {
  try {
    const users = await User.find({ userPro: true, "comments.0": { $exists: true } });
    let comments = [];
    users.forEach((user) => {
      user.comments.forEach((comment) => {
        // Find matching rating by client id
        const userRating = user.ratings.find((r) => r.userRate === comment.userComment);
        comments.push({
          commentId: comment._id,
          commentText: comment.comment,
          rating: userRating ? userRating.rating : 5,
          createdAt: comment._id.getTimestamp ? comment._id.getTimestamp() : new Date(),
          userName: comment.userName || "Anonymous",
          userAvatar: comment.userAvatar,
          handymanId: user._id,
          handymanName: user.nameuser,
          handymanBrand: user.brandName,
        });
      });
    });
    // Sort comments by date newest first
    comments.sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteCommentByAdmin = async (req, res, next) => {
  try {
    const { userId, commentId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Handyman not found" });
    }
    user.comments = user.comments.filter((c) => c._id.toString() !== commentId);
    await user.save();
    return res.status(200).json({ success: true, message: "Comment deleted successfully." });
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
    const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
    return res.status(200).json(messages);
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
    const updatedMessage = await SupportMessage.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Support ticket not found." });
    }
    return res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
};

// Delete support message
export const deleteSupportMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMessage = await SupportMessage.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "Support ticket not found." });
    }
    return res.status(200).json({ success: true, message: "Support ticket deleted successfully." });
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
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email is already in use by another account." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          nameuser,
          email,
          brandName,
          phone,
          province,
          city,
          mainService,
          subService,
          userPro,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json({ success: true, user: rest });
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

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};
