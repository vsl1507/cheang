import BasicController from "../basic.controller.js";
import SupportMessageService from "../../services/v1/supportMessage.service.js";
import { createSupportMessageSchema, updateSupportMessageSchema } from "../../schemas/v1/supportMessage.schema.js";
import { SupportMessageMapper } from "../../mappers/v1/supportMessage.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const supportMessageService = new SupportMessageService();

class SupportMessageController extends BasicController {
  constructor() {
    super(supportMessageService);
  }

  create = async (req, res) => {
    const { isValid, errors } = createSupportMessageSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = SupportMessageMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  updateStatus = async (req, res) => {
    const { isValid, errors } = updateSupportMessageSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = SupportMessageMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getSupportMessages = async (req, res) => {
    try {
      const result = await this.service.getAllSorted();
      if (result.success) {
        result.data = SupportMessageMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new SupportMessageController();
