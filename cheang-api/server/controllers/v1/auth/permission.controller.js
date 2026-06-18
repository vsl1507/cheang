import BasicController from "../../basic.controller.js";
import PermissionService from "../../../services/v1/auth/permission.service.js";
import { createPermissionSchema, updatePermissionSchema } from "../../../schemas/v1/auth/permission.schema.js";
import { PermissionMapper } from "../../../mappers/v1/auth/permission.mapper.js";
import ResponseUtil from "../../../utils/response.util.js";

class PermissionController extends BasicController {
  constructor() {
    super(new PermissionService());
  }

  create = async (req, res) => {
    const { isValid, errors } = createPermissionSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = PermissionMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updatePermissionSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = PermissionMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getAll = async (req, res) => {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
        search: req.query.search,
        includeDeleted: req.query.includeDeleted === "true",
        searchFields: ["name", "description"],
        ...this.getAdditionalOptions(req),
      };

      const result = await this.service.getAll({}, options);
      if (result.success && result.data && result.data.items) {
        result.data.items = PermissionMapper.toDTOs(result.data.items);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getById = async (req, res) => {
    try {
      const includeDeleted = req.query.includeDeleted === "true";
      const result = await this.service.getById(req.params.id, {
        includeDeleted,
        ...this.getPopulateOptions(),
      });
      if (result.success) {
        result.data = PermissionMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new PermissionController();
