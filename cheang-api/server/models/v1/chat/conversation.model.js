import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure query middleware auto-populates participants' details
conversationSchema.pre(/^find/, function (next) {
  this.populate("participants", "nameuser avatar email userPro brandName");
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
