import BasicController from "../basic.controller.js";
import BookingService from "../../services/v1/booking.service.js";
import { createBookingSchema, updateBookingSchema } from "../../schemas/v1/booking.schema.js";
import { BookingMapper } from "../../mappers/v1/booking.mapper.js";
import ResponseUtil from "../../utils/response.util.js";

const bookingService = new BookingService();

class BookingController extends BasicController {
  constructor() {
    super(bookingService);
  }

  create = async (req, res) => {
    const { isValid, errors } = createBookingSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.create(req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = BookingMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result, 201);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  update = async (req, res) => {
    const { isValid, errors } = updateBookingSchema(req.body);
    if (!isValid) {
      return ResponseUtil.badRequest(res, errors.join(", "));
    }
    try {
      const result = await this.service.update(req.params.id, req.body, req.user?.id || req.user?._id || null);
      if (result.success) {
        result.data = BookingMapper.toDTO(result.data);
      }
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };

  getBookings = async (req, res) => {
    try {
      const result = await this.service.getAllBookingsPopulated();
      return ResponseUtil.handleServiceResult(res, result);
    } catch (error) {
      return ResponseUtil.internalError(res, error.message);
    }
  };
}

export default new BookingController();
