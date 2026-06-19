import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    handyman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure a client can leave at most one review per handyman
reviewSchema.index({ client: 1, handyman: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
