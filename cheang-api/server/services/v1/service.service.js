import BasicService from "../basic.service.js";
import Serivce from "../../models/v1/service.model.js";

class ServiceService extends BasicService {
  constructor() {
    super(Serivce);
  }

  async getByUserRef(userRef) {
    try {
      const services = await this.model.find({ userRef });
      return { success: true, data: services };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default ServiceService;
