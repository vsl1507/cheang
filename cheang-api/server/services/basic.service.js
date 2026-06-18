import mongoose from "mongoose";

class BasicService {
  constructor(model, options = {}) {
    this.model = model;
    const modelName = model?.modelName;
    const isLogOrNotification = ["ActivityLog", "Notification"].includes(modelName);
    this.enableLogging = options.enableLogging !== false && !isLogOrNotification;
    this.enableNotifications = options.enableNotifications !== false && !isLogOrNotification;
  }

  /**
   * Helper to write an activity log entry
   */
  async logActivity(userId, action, targetId, description, details = null, ipAddress = null, userAgent = null) {
    if (!this.enableLogging) return;
    try {
      const ActivityLog = (await import("../models/v1/activityLog.model.js")).default;
      await ActivityLog.create({
        userId,
        action,
        targetModel: this.model.modelName,
        targetId: targetId || new mongoose.Types.ObjectId(),
        description,
        details,
        ipAddress,
        userAgent,
        createdBy: userId,
      });
    } catch (error) {
      console.error(`[BasicService] Error logging activity for ${this.model.modelName}:`, error);
    }
  }

  /**
   * Helper to send a notification to a user
   */
  async sendNotification(recipient, sender, title, message, type = "info", targetModel = null, targetId = null) {
    try {
      const Notification = (await import("../models/v1/notification.model.js")).default;
      const notification = await Notification.create({
        recipient,
        sender,
        title,
        message,
        type,
        targetModel: targetModel || this.model.modelName,
        targetId,
        createdBy: sender,
      });
      return notification;
    } catch (error) {
      console.error(`[BasicService] Error sending notification for ${this.model.modelName}:`, error);
    }
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @param {String} userId - User ID who is creating
   * @returns {Object} Result object
   */
  async create(data, userId = null) {
    try {
      const document = await this.model.create({
        ...data,
        createdBy: userId,
      });

      await this.logActivity(userId, "CREATE", document._id, `Created new ${this.model.modelName}`, { data });

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} created successfully`,
      };
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return {
          success: false,
          error: `${field} already exists`,
          code: "DUPLICATE_ERROR",
        };
      }

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return {
          success: false,
          error: errors.join(", "),
          code: "VALIDATION_ERROR",
        };
      }

      return {
        success: false,
        error: error.message,
        code: "CREATE_ERROR",
      };
    }
  }

  /**
   * Get all documents with advanced filtering, pagination, and search
   * @param {Object} query - MongoDB query object
   * @param {Object} options - Options for pagination, sorting, search
   * @returns {Object} Result object with data and pagination
   */
  async getAll(query = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        search = "",
        searchFields = [],
        populate = [],
        select = "",
        includeDeleted = false,
        lean = false,
      } = options;

      const filter = { ...query };

      // Search across multiple fields
      if (search && searchFields.length > 0) {
        filter.$or = searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        }));
      }

      const skip = (page - 1) * limit;

      let queryBuilder = this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Add select fields
      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      // Add population
      if (populate.length > 0) {
        populate.forEach((pop) => {
          if (typeof pop === "string") {
            queryBuilder = queryBuilder.populate(pop);
          } else {
            queryBuilder = queryBuilder.populate(pop.path, pop.select);
          }
        });
      }

      // Include deleted documents if requested
      if (includeDeleted) {
        queryBuilder = queryBuilder.setOptions({ includeDeleted: true });
      }

      // Convert to plain JavaScript objects if requested
      if (lean) {
        queryBuilder = queryBuilder.lean();
      }

      const documents = await queryBuilder;
      const total = await this.model.countDocuments(filter);

      return {
        success: true,
        data: {
          items: documents,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        },
        message: `${this.model.modelName} retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "GETALL_ERROR",
      };
    }
  }

  /**
   * Get document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Options for populate, select
   * @returns {Object} Result object
   */
  async getById(id, options = {}) {
    try {
      const { populate = [], select = "", includeDeleted = false } = options;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      let query = this.model.findById(id);

      // Add select fields
      if (select) {
        query = query.select(select);
      }

      // Add population
      if (populate.length > 0) {
        populate.forEach((pop) => {
          if (typeof pop === "string") {
            query = query.populate(pop);
          } else {
            query = query.populate(pop.path, pop.select);
          }
        });
      }

      // Include deleted if requested
      if (includeDeleted) {
        query = query.setOptions({ includeDeleted: true });
      }

      const document = await query;

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "GETBYID_ERROR",
      };
    }
  }

  /**
   * Get single document by query
   * @param {Object} query - MongoDB query object
   * @param {Object} options - Options for populate, select
   * @returns {Object} Result object
   */
  async getOne(query = {}, options = {}) {
    try {
      const { populate = [], select = "", includeDeleted = false } = options;

      let queryBuilder = this.model.findOne(query);

      // Add select fields
      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      // Add population
      if (populate.length > 0) {
        populate.forEach((pop) => {
          if (typeof pop === "string") {
            queryBuilder = queryBuilder.populate(pop);
          } else {
            queryBuilder = queryBuilder.populate(pop.path, pop.select);
          }
        });
      }

      // Include deleted if requested
      if (includeDeleted) {
        queryBuilder = queryBuilder.setOptions({ includeDeleted: true });
      }

      const document = await queryBuilder;

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "GETONE_ERROR",
      };
    }
  }

  /**
   * Update document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {String} userId - User ID who is updating
   * @param {Object} options - Additional options
   * @returns {Object} Result object
   */
  async update(id, data, userId = null, options = {}) {
    try {
      const { runValidators = true, new: returnNew = true } = options;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      const document = await this.model.findById(id);

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      if (document.isDeleted) {
        return {
          success: false,
          error: `Cannot update deleted ${this.model.modelName}`,
          code: "DELETED_DOCUMENT",
        };
      }

      // Update fields
      Object.assign(document, data);
      if (userId) {
        document.updatedBy = userId;
      }

      await document.save({ validateBeforeSave: runValidators });

      await this.logActivity(userId, "UPDATE", document._id, `Updated ${this.model.modelName}`, { data });

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} updated successfully`,
      };
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return {
          success: false,
          error: `${field} already exists`,
          code: "DUPLICATE_ERROR",
        };
      }

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return {
          success: false,
          error: errors.join(", "),
          code: "VALIDATION_ERROR",
        };
      }

      return {
        success: false,
        error: error.message,
        code: "UPDATE_ERROR",
      };
    }
  }

  /**
   * Update multiple documents
   * @param {Object} query - MongoDB query object
   * @param {Object} data - Update data
   * @param {String} userId - User ID who is updating
   * @returns {Object} Result object
   */
  async updateMany(query, data, userId = null) {
    try {
      const updateData = { ...data };
      if (userId) {
        updateData.updatedBy = userId;
        updateData.updatedAt = new Date();
      }

      const result = await this.model.updateMany(query, updateData);

      await this.logActivity(userId, "UPDATE_MANY", null, `Updated multiple ${this.model.modelName}(s)`, { query, data, matched: result.matchedCount, modified: result.modifiedCount });

      return {
        success: true,
        data: {
          matched: result.matchedCount,
          modified: result.modifiedCount,
        },
        message: `${result.modifiedCount} ${this.model.modelName}(s) updated successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "UPDATEMANY_ERROR",
      };
    }
  }

  /**
   * Soft delete document
   * @param {String} id - Document ID
   * @param {String} userId - User ID who is deleting
   * @returns {Object} Result object
   */
  async softDelete(id, userId = null) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      const document = await this.model.findById(id);

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      if (document.isDeleted) {
        return {
          success: false,
          error: `${this.model.modelName} already deleted`,
          code: "ALREADY_DELETED",
        };
      }

      await document.softDelete(userId);

      await this.logActivity(userId, "SOFT_DELETE", document._id, `Soft deleted ${this.model.modelName}`);

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} deleted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "SOFTDELETE_ERROR",
      };
    }
  }

  /**
   * Restore soft deleted document
   * @param {String} id - Document ID
   * @param {String} userId - User ID who is restoring
   * @returns {Object} Result object
   */
  async restore(id, userId = null) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      const document = await this.model
        .findById(id)
        .setOptions({ includeDeleted: true });

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      if (!document.isDeleted) {
        return {
          success: false,
          error: `${this.model.modelName} is not deleted`,
          code: "NOT_DELETED",
        };
      }

      await document.restore();

      await this.logActivity(userId, "RESTORE", document._id, `Restored ${this.model.modelName}`);

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} restored successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "RESTORE_ERROR",
      };
    }
  }

  /**
   * Permanent delete (use with caution)
   * @param {String} id - Document ID
   * @param {String} userId - User ID who is deleting
   * @returns {Object} Result object
   */
  async permanentDelete(id, userId = null) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      const document = await this.model.findByIdAndDelete(id);

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      await this.logActivity(userId, "PERMANENT_DELETE", document._id, `Permanently deleted ${this.model.modelName}`);

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} permanently deleted`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "PERMANENTDELETE_ERROR",
      };
    }
  }

  /**
   * Toggle active status
   * @param {String} id - Document ID
   * @param {String} userId - User ID who is toggling
   * @returns {Object} Result object
   */
  async toggleActive(id, userId = null) {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          success: false,
          error: "Invalid ID format",
          code: "INVALID_ID",
        };
      }

      const document = await this.model.findById(id);

      if (!document) {
        return {
          success: false,
          error: `${this.model.modelName} not found`,
          code: "NOT_FOUND",
        };
      }

      if (document.isDeleted) {
        return {
          success: false,
          error: `Cannot toggle deleted ${this.model.modelName}`,
          code: "DELETED_DOCUMENT",
        };
      }

      await document.toggleActive();
      if (userId) {
        document.updatedBy = userId;
        await document.save();
      }

      await this.logActivity(userId, "TOGGLE_ACTIVE", document._id, `Toggled active status of ${this.model.modelName} to ${document.isActive}`);

      return {
        success: true,
        data: document,
        message: `${this.model.modelName} status toggled successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "TOGGLE_ERROR",
      };
    }
  }

  /**
   * Get active documents only
   * @param {Object} query - Additional query filters
   * @param {Object} options - Options for populate, select
   * @returns {Object} Result object
   */
  async getActive(query = {}, options = {}) {
    try {
      const { populate = [], select = "" } = options;

      let queryBuilder = this.model.findActive(query);

      // Add select fields
      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      // Add population
      if (populate.length > 0) {
        populate.forEach((pop) => {
          if (typeof pop === "string") {
            queryBuilder = queryBuilder.populate(pop);
          } else {
            queryBuilder = queryBuilder.populate(pop.path, pop.select);
          }
        });
      }

      const documents = await queryBuilder;

      return {
        success: true,
        data: documents,
        message: `Active ${this.model.modelName}(s) retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "GETACTIVE_ERROR",
      };
    }
  }

  /**
   * Bulk soft delete
   * @param {Array} ids - Array of document IDs
   * @param {String} userId - User ID who is deleting
   * @returns {Object} Result object
   */
  async bulkDelete(ids, userId = null) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          error: "IDs must be a non-empty array",
          code: "INVALID_INPUT",
        };
      }

      const results = await Promise.allSettled(
        ids.map((id) => this.softDelete(id, userId))
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      );
      const failed = results.filter(
        (r) => r.status === "rejected" || !r.value.success
      );

      return {
        success: true,
        data: {
          successful: successful.length,
          failed: failed.length,
          total: ids.length,
        },
        message: `Deleted ${successful.length}/${ids.length} ${this.model.modelName}(s)`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "BULKDELETE_ERROR",
      };
    }
  }

  /**
   * Bulk restore
   * @param {Array} ids - Array of document IDs
   * @param {String} userId - User ID who is restoring
   * @returns {Object} Result object
   */
  async bulkRestore(ids, userId = null) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          error: "IDs must be a non-empty array",
          code: "INVALID_INPUT",
        };
      }

      const results = await Promise.allSettled(
        ids.map((id) => this.restore(id, userId))
      );

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      );
      const failed = results.filter(
        (r) => r.status === "rejected" || !r.value.success
      );

      return {
        success: true,
        data: {
          successful: successful.length,
          failed: failed.length,
          total: ids.length,
        },
        message: `Restored ${successful.length}/${ids.length} ${this.model.modelName}(s)`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "BULKRESTORE_ERROR",
      };
    }
  }

  /**
   * Bulk create documents
   * @param {Array} dataArray - Array of documents to create
   * @param {String} userId - User ID who is creating
   * @returns {Object} Result object
   */
  async bulkCreate(dataArray, userId = null) {
    try {
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return {
          success: false,
          error: "Data must be a non-empty array",
          code: "INVALID_INPUT",
        };
      }

      const documentsToCreate = dataArray.map((data) => ({
        ...data,
        createdBy: userId,
      }));

      const documents = await this.model.insertMany(documentsToCreate, {
        ordered: false,
      });

      await this.logActivity(
        userId,
        "BULK_CREATE",
        null,
        `Bulk created ${documents.length} ${this.model.modelName}(s)`,
        { count: documents.length }
      );

      return {
        success: true,
        data: documents,
        message: `${documents.length} ${this.model.modelName}(s) created successfully`,
      };
    } catch (error) {
      if (error.writeErrors) {
        return {
          success: false,
          error: `${error.insertedDocs?.length || 0} succeeded, ${
            error.writeErrors.length
          } failed`,
          code: "BULKCREATE_PARTIAL",
          details: error.writeErrors,
        };
      }

      return {
        success: false,
        error: error.message,
        code: "BULKCREATE_ERROR",
      };
    }
  }

  /**
   * Count documents
   * @param {Object} query - MongoDB query object
   * @returns {Object} Result object
   */
  async count(query = {}) {
    try {
      const count = await this.model.countDocuments(query);

      return {
        success: true,
        data: { count },
        message: `Count retrieved successfully`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "COUNT_ERROR",
      };
    }
  }

  /**
   * Check if document exists
   * @param {Object} query - MongoDB query object
   * @returns {Object} Result object
   */
  async exists(query = {}) {
    try {
      const exists = await this.model.exists(query);

      return {
        success: true,
        data: { exists: !!exists },
        message: exists ? "Document exists" : "Document does not exist",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "EXISTS_ERROR",
      };
    }
  }

  /**
   * Get statistics
   * @returns {Object} Result object with statistics
   */
  async getStats() {
    try {
      const total = await this.model.countDocuments();
      const active = await this.model.countActive();
      const inactive = await this.model.countDocuments({
        isActive: false,
        isDeleted: false,
      });
      const deleted = await this.model.countDocuments({ isDeleted: true });

      return {
        success: true,
        data: {
          total,
          active,
          inactive,
          deleted,
          activePercentage: total > 0 ? ((active / total) * 100).toFixed(2) : 0,
          deletedPercentage:
            total > 0 ? ((deleted / total) * 100).toFixed(2) : 0,
        },
        message: "Statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "STATS_ERROR",
      };
    }
  }

  /**
   * Aggregate query
   * @param {Array} pipeline - MongoDB aggregation pipeline
   * @returns {Object} Result object
   */
  async aggregate(pipeline) {
    try {
      const result = await this.model.aggregate(pipeline);

      return {
        success: true,
        data: result,
        message: "Aggregation completed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "AGGREGATE_ERROR",
      };
    }
  }

  /**
   * Search with text index
   * @param {String} searchText - Text to search
   * @param {Object} options - Additional options
   * @returns {Object} Result object
   */
  async searchText(searchText, options = {}) {
    try {
      const { limit = 10, skip = 0 } = options;

      const documents = await this.model
        .find(
          { $text: { $search: searchText } },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .skip(skip);

      return {
        success: true,
        data: documents,
        message: "Search completed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: "SEARCH_ERROR",
      };
    }
  }

  /**
   * Find with pagination helper
   * @param {Object} query - MongoDB query
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} options - Additional options
   * @returns {Object} Result object
   */
  async paginate(query = {}, page = 1, limit = 10, options = {}) {
    return this.getAll(query, { ...options, page, limit });
  }
}

export default BasicService;
