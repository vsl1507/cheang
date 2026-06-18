import mongoose from "mongoose";
import MongooseDocument, {
  basicMethods,
  basicStatics,
  excludeDeletedMiddleware,
} from "../basic.model.js";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // can be null for anonymous or system operations
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    targetModel: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
      trim: true,
    },
    userAgent: {
      type: String,
      required: false,
      trim: true,
    },
    ...MongooseDocument,
  },
  { timestamps: true }
);

activityLogSchema.index({
  action: "text",
  targetModel: "text",
  description: "text",
});

// Add common methods
Object.assign(activityLogSchema.methods, basicMethods);

// Add common static methods
Object.assign(activityLogSchema.statics, basicStatics);

// Add query middleware to auto-exclude deleted documents
activityLogSchema.pre(/^find/, excludeDeletedMiddleware);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
