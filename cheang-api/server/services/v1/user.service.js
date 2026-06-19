import BasicService from "../basic.service.js";
import User from "../../models/v1/user.model.js";
import bcryptjs from "bcryptjs";

class UserService extends BasicService {
  constructor() {
    super(User);
  }

  async updateProfile(id, data, userId) {
    try {
      if (data.password) {
        data.password = bcryptjs.hashSync(data.password, 10);
      }
      return await this.update(id, data, userId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllProfessionals(currentUserId) {
    try {
      const query = { userPro: true };
      if (currentUserId) {
        query._id = { $ne: currentUserId };
      }
      const users = await this.model.find(query);
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchUsers(currentUserId, options = {}) {
    try {
      const { startIndex = 0, limit = 9, searchTerm = "", locations = "location", order = "desc" } = options;
      const query = {
        userPro: true,
        nameuser: { $regex: searchTerm, $options: "i" }
      };
      if (currentUserId) {
        query._id = { $ne: currentUserId };
      }

      const users = await this.model.find(query)
        .sort({ [locations]: order })
        .limit(parseInt(limit))
        .skip(parseInt(startIndex));

      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async liveSearch(filters = {}) {
    try {
      const { mainService, subService, province, city } = filters;
      const liveSearchQuery = {
        userPro: true,
        admin: false
      };

      if (mainService) liveSearchQuery.mainService = mainService;
      if (subService) liveSearchQuery.subService = subService;
      if (province) liveSearchQuery.province = province;
      if (city) liveSearchQuery.city = city;

      const users = await this.model.find(liveSearchQuery);
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default UserService;
