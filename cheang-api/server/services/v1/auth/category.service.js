import Category from "../../../models/v1/auth/category.model.js";

class CategoryService {
  // Create a new category
  async create(data, userId) {
    try {
      const category = await Category.create({
        ...data,
        createdBy: userId,
      });
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all categories (excludes deleted by default)
  async getAll(query = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        search = "",
        status = "",
        includeDeleted = false,
      } = options;

      const filter = { ...query };

      // Search across multiple fields
      if (search) {
        filter.$or = [
          { nameEn: { $regex: search, $options: "i" } },
          { nameKh: { $regex: search, $options: "i" } },
          { nameZh: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by status
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      let queryBuilder = Category.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .populate("deletedBy", "name email");

      // Include deleted if requested
      if (includeDeleted) {
        queryBuilder = queryBuilder.setOptions({ includeDeleted: true });
      }

      const categories = await queryBuilder;
      const total = await Category.countDocuments(filter);

      return {
        success: true,
        data: {
          data: categories,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get category by ID
  async getById(id, includeDeleted = false) {
    try {
      let query = Category.findById(id)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .populate("deletedBy", "name email");

      if (includeDeleted) {
        query = query.setOptions({ includeDeleted: true });
      }

      const category = await query;

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update category
  async update(id, data, userId) {
    try {
      const category = await Category.findById(id);

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      if (category.isDeleted) {
        return { success: false, error: "Cannot update deleted category" };
      }

      Object.assign(category, data);
      category.updatedBy = userId;
      await category.save();

      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Soft delete category
  async softDelete(id, userId) {
    try {
      const category = await Category.findById(id);

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      if (category.isDeleted) {
        return { success: false, error: "Category already deleted" };
      }

      await category.softDelete(userId);

      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Restore deleted category
  async restore(id) {
    try {
      const category = await Category.findById(id).setOptions({
        includeDeleted: true,
      });

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      if (!category.isDeleted) {
        return { success: false, error: "Category is not deleted" };
      }

      await category.restore();

      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Permanent delete (use with caution)
  async permanentDelete(id) {
    try {
      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      return {
        success: true,
        message: "Category permanently deleted",
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Toggle active status
  async toggleActive(id, userId) {
    try {
      const category = await Category.findById(id);

      if (!category) {
        return { success: false, error: "Category not found" };
      }

      if (category.isDeleted) {
        return { success: false, error: "Cannot toggle deleted category" };
      }

      await category.toggleActive();
      category.updatedBy = userId;
      await category.save();

      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get active categories only
  async getActive() {
    try {
      const categories = await Category.findActive();

      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Bulk operations
  async bulkDelete(ids, userId) {
    try {
      const results = await Promise.all(
        ids.map((id) => this.softDelete(id, userId))
      );

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return {
        success: true,
        message: `Deleted ${successful} categories, ${failed} failed`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async bulkRestore(ids) {
    try {
      const results = await Promise.all(ids.map((id) => this.restore(id)));

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return {
        success: true,
        message: `Restored ${successful} categories, ${failed} failed`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get statistics
  async getStats() {
    try {
      const total = await Category.countDocuments();
      const active = await Category.countActive();
      const inactive = await Category.countDocuments({
        isActive: false,
        isDeleted: false,
      });
      const deleted = await Category.countDocuments({ isDeleted: true });

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          deleted,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CategoryService;
