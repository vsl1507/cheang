import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
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

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
export default SupportMessage;
