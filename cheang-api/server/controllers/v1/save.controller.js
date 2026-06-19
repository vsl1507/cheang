import BasicController from "../basic.controller.js";
import SaveService from "../../services/v1/save.service.js";
import { SaveMapper } from "../../mappers/v1/save.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const saveService = new SaveService();

class SaveController extends BasicController {
  constructor() {
    super(saveService);
  }
}

export default new SaveController();
