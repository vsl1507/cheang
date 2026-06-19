import mongoose from "mongoose";
import MongooseDocument, { basicMethods, basicStatics, excludeDeletedMiddleware } from "../basic.model.js";

const supportMessageSchema = new mongoose.Schema(
  {
    ...MongooseDocument,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Pending", "Resolved"],
      default: "New",
    },
  },
  { timestamps: true }
);

supportMessageSchema.methods = { ...basicMethods };
supportMessageSchema.statics = { ...basicStatics };
supportMessageSchema.pre(/^find/, excludeDeletedMiddleware);

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
export default SupportMessage;
