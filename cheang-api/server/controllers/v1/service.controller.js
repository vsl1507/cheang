import BasicController from "../basic.controller.js";
import ServiceService from "../../services/v1/service.service.js";
import { createServiceSchema, updateServiceSchema } from "../../schemas/v1/service.schema.js";
import { ServiceMapper } from "../../mappers/v1/service.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const serviceService = new ServiceService();

class ServiceController extends BasicController {
  constructor() {
    super(serviceService);
  }

  create = async (req, res) => {
    const { isValid, errors } = createServiceSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = ServiceMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updateServiceSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const serviceRes = await this.service.getById(req.params.id);
      if (!serviceRes.success) {
        return ResponseUtil.handleServiceResult(res, serviceRes);
      }
      if (req.user?.id !== serviceRes.data.userRef.toString() && req.user?._id !== serviceRes.data.userRef.toString()) {
        return ResponseUtil.unauthorized(res, "You can only update your own listings!");
      }

      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = ServiceMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  delete = async (req, res) => {
    try {
      const serviceRes = await this.service.getById(req.params.id);
      if (!serviceRes.success) {
        return ResponseUtil.handleServiceResult(res, serviceRes);
      }
      if (req.user?.id !== serviceRes.data.userRef.toString() && req.user?._id !== serviceRes.data.userRef.toString()) {
        return ResponseUtil.unauthorized(res, "You can only delete your own listings!");
      }

      const result = await this.service.permanentDelete(req.params.id, req.user?.id || req.user?._id || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getById = async (req, res) => {
    try {
      const result = await this.service.getById(req.params.id, { populate: ["userRef"] });
      if (result.success) {
        result.data = ServiceMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getAllActiveServices = async (req, res) => {
    try {
      const result = await this.service.getActive({}, { populate: ["userRef"] });
      if (result.success) {
        result.data = ServiceMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getUserService = async (req, res) => {
    if (req.user?.id !== req.params.id && req.user?._id !== req.params.id) {
      return ResponseUtil.unauthorized(res, "You can only view your own service!");
    }
    try {
      const result = await this.service.getByUserRef(req.params.id);
      if (result.success) {
        result.data = ServiceMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getServiceUser = async (req, res) => {
    try {
      const result = await this.service.getByUserRef(req.params.id);
      if (result.success) {
        result.data = ServiceMapper.toDTOs(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new ServiceController();
