/**
 * Standard API Response Utility
 * Provides consistent response structure across the application
 */

class ResponseUtil {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code
   * @param {Object} meta - Additional metadata
   * @returns {Object} JSON response
   */
  static success(
    res,
    data = null,
    message = "Success",
    statusCode = 200,
    meta = {}
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...meta,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {String} errorCode - Custom error code
   * @param {Object} errors - Detailed errors
   * @returns {Object} JSON response
   */
  static error(
    res,
    message = "Error",
    statusCode = 500,
    errorCode = null,
    errors = null
  ) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errorCode) {
      response.errorCode = errorCode;
    }

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   * @param {Object} res - Express response object
   * @param {Object} data - Created resource data
   * @param {String} message - Success message
   * @returns {Object} JSON response
   */
  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  /**
   * No content response (204)
   * @param {Object} res - Express response object
   * @returns {Object} Empty response
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Bad request response (400)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors
   * @returns {Object} JSON response
   */
  static badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, message, 400, "BAD_REQUEST", errors);
  }

  /**
   * Unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static unauthorized(res, message = "Unauthorized access") {
    return this.error(res, message, 401, "UNAUTHORIZED");
  }

  /**
   * Forbidden response (403)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static forbidden(res, message = "Forbidden access") {
    return this.error(res, message, 403, "FORBIDDEN");
  }

  /**
   * Not found response (404)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404, "NOT_FOUND");
  }

  /**
   * Conflict response (409)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static conflict(res, message = "Resource already exists") {
    return this.error(res, message, 409, "CONFLICT");
  }

  /**
   * Unprocessable entity response (422)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Object} errors - Validation errors
   * @returns {Object} JSON response
   */
  static unprocessableEntity(
    res,
    message = "Validation failed",
    errors = null
  ) {
    return this.error(res, message, 422, "VALIDATION_ERROR", errors);
  }

  /**
   * Too many requests response (429)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, 429, "TOO_MANY_REQUESTS");
  }

  /**
   * Internal server error response (500)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static internalError(res, message = "Internal server error") {
    return this.error(res, message, 500, "INTERNAL_ERROR");
  }

  /**
   * Service unavailable response (503)
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @returns {Object} JSON response
   */
  static serviceUnavailable(res, message = "Service temporarily unavailable") {
    return this.error(res, message, 503, "SERVICE_UNAVAILABLE");
  }

  /**
   * Paginated response
   * @param {Object} res - Express response object
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination metadata
   * @param {String} message - Success message
   * @returns {Object} JSON response
   */
  static paginated(
    res,
    data,
    pagination,
    message = "Data retrieved successfully"
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        pages: pagination.pages,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle service result
   * @param {Object} res - Express response object
   * @param {Object} result - Service result object
   * @param {Number} successCode - Success status code
   * @returns {Object} JSON response
   */
  static handleServiceResult(res, result, successCode = 200) {
    if (result.success) {
      // Handle paginated data
      if (result.data && result.data.items && result.data.pagination) {
        return this.paginated(
          res,
          result.data.items,
          result.data.pagination,
          result.message
        );
      }

      return this.success(res, result.data, result.message, successCode);
    }

    // Map error codes to appropriate HTTP status codes
    const statusCodeMap = {
      NOT_FOUND: 404,
      VALIDATION_ERROR: 422,
      DUPLICATE_ERROR: 409,
      INVALID_ID: 400,
      ALREADY_DELETED: 400,
      DELETED_DOCUMENT: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      INVALID_INPUT: 400,
    };

    const statusCode = statusCodeMap[result.code] || 500;
    return this.error(
      res,
      result.error,
      statusCode,
      result.code,
      result.details
    );
  }

  /**
   * Custom response
   * @param {Object} res - Express response object
   * @param {Number} statusCode - HTTP status code
   * @param {Object} data - Response data
   * @returns {Object} JSON response
   */
  static custom(res, statusCode, data) {
    return res.status(statusCode).json(data);
  }
}

export default ResponseUtil;
