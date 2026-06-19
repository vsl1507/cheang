import BasicController from "../basic.controller.js";
import UserService from "../../services/v1/user.service.js";
import ReviewService from "../../services/v1/review.service.js";
import SaveService from "../../services/v1/save.service.js";
import { createUserSchema, updateUserSchema } from "../../schemas/v1/user.schema.js";
import { UserMapper } from "../../mappers/v1/user.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const userService = new UserService();
const reviewService = new ReviewService();
const saveService = new SaveService();

class UserController extends BasicController {
  constructor() {
    super(userService);
  }

  populateUserCommentsAndSaves = async (userObj) => {
    if (!userObj) return null;
    const userId = userObj.id || userObj._id;

    const reviewsRes = await reviewService.getReviewsForHandyman(userId);
    const reviews = reviewsRes.success ? reviewsRes.data : [];

    const formattedRatings = reviews.map(r => ({
      _id: r._id,
      userRate: r.client ? r.client._id.toString() : "",
      rating: r.rating
    }));

    const formattedComments = reviews
      .filter(r => r.comment && r.comment.trim() !== "")
      .map(r => ({
        _id: r._id,
        userComment: r.client ? r.client._id.toString() : "",
        userName: r.client ? r.client.nameuser : "",
        userAvatar: r.client ? r.client.avatar : "",
        comment: r.comment,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));

    const savesRes = await saveService.getSavesBySaver(userId);
    const saves = savesRes.success ? savesRes.data : [];

    const formattedSaves = saves.map(s => ({
      _id: s._id,
      userId: s.userSaved ? s.userSaved._id.toString() : "",
      userName: s.userSaved ? s.userSaved.nameuser : "",
      userAvatar: s.userSaved ? s.userSaved.avatar : "",
      saveSign: s.saveSign,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    userObj.ratings = formattedRatings;
    userObj.comments = formattedComments;
    userObj.saves = formattedSaves;

    return userObj;
  };

  update = async (req, res) => {
    if (req.user?.id !== req.params.id && req.user?._id !== req.params.id) {
      return ResponseUtil.unauthorized(res, "You can only update your own account!");
    }
    const { isValid, errors } = updateUserSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.updateProfile(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        let mapped = UserMapper.toDTO(result.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        result.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  delete = async (req, res) => {
    if (req.user?.id !== req.params.id && req.user?._id !== req.params.id) {
      return ResponseUtil.unauthorized(res, "You can only delete your own account!");
    }
    try {
      const result = await this.service.permanentDelete(req.params.id, req.user?.id || req.user?._id || null);
      if (result.success) {
        res.clearCookie("access_token");
        return ResponseUtil.success(res, null, "User has been deleted!");
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getUser = async (req, res) => {
    try {
      const result = await this.service.getById(req.params.id);
      if (result.success) {
        let mapped = UserMapper.toDTO(result.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        result.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getAllUserAc = async (req, res) => {
    try {
      const currentUserId = req.user?.id || req.user?._id;
      const result = await this.service.getAllProfessionals(currentUserId);
      if (result.success) {
        result.data = UserMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getAllUser = async (req, res) => {
    try {
      const result = await this.service.getAllProfessionals(null);
      if (result.success) {
        result.data = UserMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  ratingUser = async (req, res) => {
    const { rating } = req.body;
    const client = req.user?.id || req.user?._id;
    const handyman = req.params.id;

    try {
      const ratingRes = await reviewService.upsertRating(client, handyman, rating);
      if (!ratingRes.success) {
        return ResponseUtil.handleServiceResult(res, ratingRes);
      }
      const userRes = await this.service.getById(handyman);
      if (userRes.success) {
        let mapped = UserMapper.toDTO(userRes.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        userRes.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, userRes);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  commentUser = async (req, res) => {
    const { comment } = req.body;
    const client = req.user?.id || req.user?._id;
    const handyman = req.params.id;

    try {
      const commentRes = await reviewService.upsertComment(client, handyman, comment);
      if (!commentRes.success) {
        return ResponseUtil.handleServiceResult(res, commentRes);
      }
      const userRes = await this.service.getById(handyman);
      if (userRes.success) {
        let mapped = UserMapper.toDTO(userRes.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        userRes.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, userRes);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  deleteCommentUser = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.body.user;

    try {
      const deleteRes = await reviewService.permanentDelete(commentId);
      if (!deleteRes.success) {
        return ResponseUtil.handleServiceResult(res, deleteRes);
      }
      const userRes = await this.service.getById(userId);
      if (userRes.success) {
        let mapped = UserMapper.toDTO(userRes.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        userRes.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, userRes);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  saveUser = async (req, res) => {
    const { userId } = req.params;
    const userSaver = req.user?.id || req.user?._id;

    try {
      const saveRes = await saveService.toggleSave(userSaver, userId);
      if (!saveRes.success) {
        return ResponseUtil.handleServiceResult(res, saveRes);
      }
      const userRes = await this.service.getById(userSaver);
      if (userRes.success) {
        let mapped = UserMapper.toDTO(userRes.data);
        mapped = await this.populateUserCommentsAndSaves(mapped);
        userRes.data = mapped;
      }
      return ResponseUtil.handleServiceResult(res, userRes);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  searchUsers = async (req, res) => {
    try {
      const currentUserId = req.user?.id || req.user?._id;
      const result = await this.service.searchUsers(currentUserId, req.query);
      if (result.success) {
        result.data = UserMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  liveSearch = async (req, res) => {
    try {
      const result = await this.service.liveSearch(req.query);
      if (result.success) {
        result.data = UserMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new UserController();
