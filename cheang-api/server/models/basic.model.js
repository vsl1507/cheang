import mongoose from "mongoose";

// Common Mongoose document fields that can be spread into any schema
export const MongooseDocument = {
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map(),
  },
};

// Common schema methods that can be added to any model
export const basicMethods = {
  // Soft delete method
  softDelete: function (userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  },

  // Restore soft-deleted document
  restore: function () {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  },

  // Toggle active status
  toggleActive: function () {
    this.isActive = !this.isActive;
    return this.save();
  },
};

// Common static methods
export const basicStatics = {
  // Find only active and non-deleted documents
  findActive: function (query = {}) {
    return this.find({ ...query, isActive: true, isDeleted: false });
  },

  // Find including soft-deleted documents
  findWithDeleted: function (query = {}) {
    return this.find(query);
  },

  // Count active documents
  countActive: function (query = {}) {
    return this.countDocuments({ ...query, isActive: true, isDeleted: false });
  },
};

// Query middleware function to exclude soft-deleted by default
export const excludeDeletedMiddleware = function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
};

export default MongooseDocument;
