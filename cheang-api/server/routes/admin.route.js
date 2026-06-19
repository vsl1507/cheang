import express from "express";
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";
import {
  usersReq,
  toggleAdminRole,
  deleteUserByAdmin,
  getBookings,
  getAllComments,
  deleteCommentByAdmin,
  getActivityLogs,
  getSupportMessages,
  updateSupportMessageStatus,
  deleteSupportMessage,
  editUserByAdmin,
  resetUserPasswordByAdmin,
} from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/usersreq", verifyToken, verifyAdmin, usersReq);
adminRouter.put("/toggle-admin/:id", verifyToken, verifyAdmin, toggleAdminRole);
adminRouter.delete("/delete-user/:id", verifyToken, verifyAdmin, deleteUserByAdmin);
adminRouter.get("/bookings", verifyToken, verifyAdmin, getBookings);
adminRouter.get("/comments", verifyToken, verifyAdmin, getAllComments);
adminRouter.delete("/comments/:userId/:commentId", verifyToken, verifyAdmin, deleteCommentByAdmin);
adminRouter.get("/logs", verifyToken, verifyAdmin, getActivityLogs);
adminRouter.get("/support-messages", verifyToken, verifyAdmin, getSupportMessages);
adminRouter.put("/support-messages/:id", verifyToken, verifyAdmin, updateSupportMessageStatus);
adminRouter.delete("/support-messages/:id", verifyToken, verifyAdmin, deleteSupportMessage);
adminRouter.put("/edit-user/:id", verifyToken, verifyAdmin, editUserByAdmin);
adminRouter.put("/reset-password/:id", verifyToken, verifyAdmin, resetUserPasswordByAdmin);

export default adminRouter;
