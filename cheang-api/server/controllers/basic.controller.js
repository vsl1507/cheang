import ResponseUtil from "../utils/response.util.js";
class BasicController {
  constructor(service) {
    this.service = service;
  }

  // Create
  create = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.create(req.body, userId || null);
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Get all with pagination
  getAll = async (req, res) => {
    try {
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
        search: req.query.search,
        includeDeleted: req.query.includeDeleted === "true",
        ...this.getAdditionalOptions(req),
      };

      const result = await this.service.getAll({}, options);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Get by ID
  getById = async (req, res) => {
    try {
      const includeDeleted = req.query.includeDeleted === "true";
      const result = await this.service.getById(req.params.id, {
        includeDeleted,
        ...this.getPopulateOptions(),
      });
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Update
  update = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.update(req.params.id, req.body, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Soft delete
  softDelete = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.softDelete(req.params.id, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Restore
  restore = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.restore(req.params.id, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Permanent delete
  permanentDelete = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.permanentDelete(req.params.id, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Toggle active
  toggleActive = async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const result = await this.service.toggleActive(req.params.id, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Get active
  getActive = async (req, res) => {
    try {
      const result = await this.service.getActive(
        {},
        this.getPopulateOptions()
      );
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Bulk delete
  bulkDelete = async (req, res) => {
    try {
      const { ids } = req.body;
      const userId = req.user?.id || req.user?._id;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return ResponseUtil.badRequest(res, "Please provide an array of IDs");
      }

      const result = await this.service.bulkDelete(ids, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Bulk restore
  bulkRestore = async (req, res) => {
    try {
      const { ids } = req.body;
      const userId = req.user?.id || req.user?._id;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return ResponseUtil.badRequest(res, "Please provide an array of IDs");
      }

      const result = await this.service.bulkRestore(ids, userId || null);
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Get statistics
  getStats = async (req, res) => {
    try {
      const result = await this.service.getStats();
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  // Override these methods in child controllers for custom behavior
  getAdditionalOptions(req) {
    return {};
  }

  getPopulateOptions() {
    return {
      populate: [
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
        { path: "deletedBy", select: "name email" },
      ],
    };
  }
}

export default BasicController;
