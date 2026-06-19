import BasicService from "../basic.service.js";
import SupportMessage from "../../models/v1/supportMessage.model.js";

class SupportMessageService extends BasicService {
  constructor() {
    super(SupportMessage);
  }

  async getAllSorted() {
    try {
      const messages = await this.model.find({}).sort({ createdAt: -1 });
      return { success: true, data: messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default SupportMessageService;
