import BasicController from "../basic.controller.js";
import NotificationService from "../../services/v1/notification.service.js";
import { NotificationMapper } from "../../mappers/v1/notification.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const notificationService = new NotificationService();

class NotificationController extends BasicController {
  constructor() {
    super(notificationService);
  }

  getMyNotifications = async (req, res) => {
    try {
      const recipientId = req.user?.id || req.user?._id;
      if (!recipientId) {
        return ResponseUtil.unauthorized(res);
      }

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: "-createdAt",
      };

      const result = await this.service.getAll({ recipient: recipientId }, options);
      if (result.success && result.data && result.data.items) {
        result.data.items = NotificationMapper.toDTOs(result.data.items);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  markAllAsRead = async (req, res) => {
    try {
      const recipientId = req.user?.id || req.user?._id;
      if (!recipientId) {
        return ResponseUtil.unauthorized(res);
      }

      const result = await this.service.markAllAsRead(recipientId);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  deleteNotification = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const notifRes = await this.service.getById(req.params.id);
      if (!notifRes.success) {
        return ResponseUtil.handleServiceResult(res, notifRes);
      }

      // Check owner
      if (notifRes.data.recipient.toString() !== userId.toString()) {
        return ResponseUtil.unauthorized(res, "You can only delete your own notifications");
      }

      const result = await this.service.softDelete(req.params.id, userId);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new NotificationController();
