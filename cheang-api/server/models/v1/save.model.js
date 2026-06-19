import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    userSaver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userSaved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saveSign: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

saveSchema.index({ userSaver: 1, userSaved: 1 }, { unique: true });

const Save = mongoose.model("Save", saveSchema);
export default Save;
