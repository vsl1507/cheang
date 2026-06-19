import BasicController from "../basic.controller.js";
import ReviewService from "../../services/v1/review.service.js";
import { createReviewSchema, updateReviewSchema } from "../../schemas/v1/review.schema.js";
import { ReviewMapper } from "../../mappers/v1/review.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const reviewService = new ReviewService();

class ReviewController extends BasicController {
  constructor() {
    super(reviewService);
  }

  getAllComments = async (req, res) => {
    try {
      const result = await this.service.getAllCommentsPopulated();
      if (result.success) {
        const comments = result.data.map((review) => {
          const commenter = review.client || {};
          const handyman = review.handyman || {};
          return {
            commentId: review._id,
            commentText: review.comment,
            rating: review.rating,
            createdAt: review.createdAt,
            userName: commenter.nameuser || "Anonymous",
            userAvatar: commenter.avatar,
            handymanId: handyman._id,
            handymanName: handyman.nameuser || "Anonymous",
            handymanBrand: handyman.brandName || "",
          };
        });
        result.data = comments;
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  deleteCommentByAdmin = async (req, res) => {
    try {
      const { commentId } = req.params;
      const result = await this.service.permanentDelete(commentId, req.user?.id || req.user?._id || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new ReviewController();
