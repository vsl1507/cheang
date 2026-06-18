import BasicService from "../basic.service.js";
import Notification from "../../models/v1/notification.model.js";

class NotificationService extends BasicService {
  constructor() {
    super(Notification, { enableLogging: false });
  }

  /**
   * Mark user notifications as read
   * @param {String} userId - Recipient User ID
   * @returns {Object} Result object
   */
  async markAllAsRead(userId) {
    try {
      const result = await this.model.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      return {
        success: true,
        data: result,
        message: `Marked all notifications as read`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "READ_ALL_ERROR",
      };
    }
  }
}

export default NotificationService;
