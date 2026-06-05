// import categoryService from "../../../services/v1/auth/category.service";

// class CategoryController {
//   // Create category
//   async create(req, res) {
//     try {
//       const userId = req.user?.id || req.user?._id;
//       const result = await categoryService.create(req.body, userId);
//       return ResponseUtil.handleServiceResult(res, result, 201);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Get all categories
//   async getAll(req, res) {
//     try {
//       const options = {
//         page: req.query.page,
//         limit: req.query.limit,
//         sort: req.query.sort,
//         search: req.query.search,
//         status: req.query.status,
//         includeDeleted: req.query.includeDeleted === "true",
//         searchFields: ["nameEn", "nameKh", "nameZh", "description"],
//         populate: [
//           { path: "createdBy", select: "name email" },
//           { path: "updatedBy", select: "name email" },
//         ],
//       };

//       const result = await categoryService.getAll({}, options);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Get category by ID
//   async getById(req, res) {
//     try {
//       const includeDeleted = req.query.includeDeleted === "true";
//       const result = await categoryService.getById(req.params.id, {
//         includeDeleted,
//         populate: [
//           { path: "createdBy", select: "name email" },
//           { path: "updatedBy", select: "name email" },
//           { path: "deletedBy", select: "name email" },
//         ],
//       });
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Update category
//   async update(req, res) {
//     try {
//       const userId = req.user?.id || req.user?._id;
//       const result = await categoryService.update(
//         req.params.id,
//         req.body,
//         userId
//       );
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Soft delete category
//   async softDelete(req, res) {
//     try {
//       const userId = req.user?.id || req.user?._id;
//       const result = await categoryService.softDelete(req.params.id, userId);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Restore deleted category
//   async restore(req, res) {
//     try {
//       const result = await categoryService.restore(req.params.id);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Permanent delete
//   async permanentDelete(req, res) {
//     try {
//       const result = await categoryService.permanentDelete(req.params.id);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Toggle active status
//   async toggleActive(req, res) {
//     try {
//       const userId = req.user?.id || req.user?._id;
//       const result = await categoryService.toggleActive(req.params.id, userId);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Get active categories only
//   async getActive(req, res) {
//     try {
//       const result = await categoryService.getActive(
//         {},
//         {
//           populate: [{ path: "createdBy", select: "name email" }],
//         }
//       );
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Bulk delete
//   async bulkDelete(req, res) {
//     try {
//       const { ids } = req.body;
//       const userId = req.user?.id || req.user?._id;

//       if (!ids || !Array.isArray(ids) || ids.length === 0) {
//         return ResponseUtil.badRequest(
//           res,
//           "Please provide an array of category IDs"
//         );
//       }

//       const result = await categoryService.bulkDelete(ids, userId);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Bulk restore
//   async bulkRestore(req, res) {
//     try {
//       const { ids } = req.body;

//       if (!ids || !Array.isArray(ids) || ids.length === 0) {
//         return ResponseUtil.badRequest(
//           res,
//           "Please provide an array of category IDs"
//         );
//       }

//       const result = await categoryService.bulkRestore(ids);
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }

//   // Get statistics
//   async getStats(req, res) {
//     try {
//       const result = await categoryService.getStats();
//       return ResponseUtil.handleServiceResult(res, result);
//     } catch (error) {
//       return ResponseUtil.internalError(res, error.message);
//     }
//   }
// }

// export default new CategoryController();

import BasicController from "../../basic.controller.js";
import CategoryService from "../../../services/v1/auth/category.service.js";

class CategoryController extends BasicController {
  constructor() {
    super(new CategoryService());
  }

  // OPTIONAL: override filters
  getAdditionalOptions(req) {
    return {
      categoryType: req.query.type,
    };
  }

  // OPTIONAL: override populate
  getPopulateOptions() {
    return {
      populate: [{ path: "createdBy", select: "name" }],
    };
  }
}

export default new CategoryController();
