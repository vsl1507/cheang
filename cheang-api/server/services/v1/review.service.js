import BasicService from "../basic.service.js";
import Review from "../../models/v1/review.model.js";

class ReviewService extends BasicService {
  constructor() {
    super(Review);
  }

  async getReviewsForHandyman(handymanId) {
    try {
      const reviews = await this.model.find({ handyman: handymanId })
        .populate("client", "nameuser avatar")
        .sort({ createdAt: -1 });
      return { success: true, data: reviews };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllCommentsPopulated() {
    try {
      const reviews = await this.model.find({ comment: { $ne: "" } })
        .populate("client", "nameuser avatar")
        .populate("handyman", "nameuser brandName")
        .sort({ createdAt: -1 });
      return { success: true, data: reviews };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async upsertRating(client, handyman, rating) {
    try {
      const review = await this.model.findOneAndUpdate(
        { client, handyman },
        { $set: { rating } },
        { upsert: true, new: true }
      );
      return { success: true, data: review };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async upsertComment(client, handyman, comment) {
    try {
      const review = await this.model.findOneAndUpdate(
        { client, handyman },
        { $set: { comment } },
        { upsert: true, new: true }
      );
      return { success: true, data: review };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default ReviewService;
