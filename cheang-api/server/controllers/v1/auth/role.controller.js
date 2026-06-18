import BasicController from "../../basic.controller.js";
import RoleService from "../../../services/v1/auth/role.service.js";
import { createRoleSchema, updateRoleSchema } from "../../../schemas/v1/auth/role.schema.js";
import { RoleMapper } from "../../../mappers/v1/auth/role.mapper.js";
import ResponseUtil from "../../../utils/response.util.js";

class RoleController extends BasicController {
  constructor() {
    super(new RoleService());
  }

  getPopulateOptions() {
    return {
      populate: [
        { path: "permissions", select: "name description" },
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
        { path: "deletedBy", select: "name email" },
      ],
    };
  }

  create = async (req, res) => {
    const { isValid, errors } = createRoleSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = RoleMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updateRoleSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = RoleMapper.toDTO(result.data);
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
        populate: [{ path: "permissions", select: "name description" }],
        ...this.getAdditionalOptions(req),
      };

      const result = await this.service.getAll({}, options);
      if (result.success && result.data && result.data.items) {
        result.data.items = RoleMapper.toDTOs(result.data.items);
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
        result.data = RoleMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new RoleController();
