import BasicController from "../../basic.controller.js";
import CategoryService from "../../../services/v1/auth/category.service.js";
import { createCategorySchema, updateCategorySchema } from "../../../schemas/v1/auth/category.schema.js";
import { CategoryMapper } from "../../../mappers/v1/auth/category.mapper.js";
import ResponseUtil from "../../../utils/response.util.js";

class CategoryController extends BasicController {
  constructor() {
    super(new CategoryService());
  }

  create = async (req, res) => {
    const { isValid, errors } = createCategorySchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.create(req.body, userId || null);
      if (result.success) {
        result.data = CategoryMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updateCategorySchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.update(req.params.id, req.body, userId || null);
      if (result.success) {
        result.data = CategoryMapper.toDTO(result.data);
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
        searchFields: ["nameEn", "nameKh", "nameZh", "description"],
        ...this.getAdditionalOptions(req),
      };

      const result = await this.service.getAll({}, options);
      if (result.success && result.data && result.data.items) {
        result.data.items = CategoryMapper.toDTOs(result.data.items);
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
        result.data = CategoryMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getAdditionalOptions(req) {
    return {};
  }

  getPopulateOptions() {
    return {
      populate: [
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
      ],
    };
  }
}

export default new CategoryController();
