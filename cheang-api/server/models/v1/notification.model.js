import mongoose from "mongoose";
import MongooseDocument, {
  basicMethods,
  basicStatics,
  excludeDeletedMiddleware,
} from "../basic.model.js";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    targetModel: {
      type: String,
      required: false,
      trim: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      index: true,
    },
    ...MongooseDocument,
  },
  { timestamps: true }
);

notificationSchema.index({
  title: "text",
  message: "text",
});

// Add common methods
Object.assign(notificationSchema.methods, basicMethods);

// Add common static methods
Object.assign(notificationSchema.statics, basicStatics);

// Add query middleware to auto-exclude deleted documents
notificationSchema.pre(/^find/, excludeDeletedMiddleware);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
