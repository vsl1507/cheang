import BasicService from "../basic.service.js";
import Booking from "../../models/v1/booking.model.js";

class BookingService extends BasicService {
  constructor() {
    super(Booking);
  }

  async getAllBookingsPopulated() {
    try {
      const bookings = await this.model.find({})
        .populate("client", "nameuser email avatar")
        .populate("handyman", "nameuser email avatar brandName")
        .sort({ createdAt: -1 });
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default BookingService;
