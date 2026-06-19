export class BookingMapper {
  static toDTO(booking) {
    if (!booking) return null;
    const bookingObj = booking.toObject ? booking.toObject() : { ...booking };
    return {
      id: bookingObj._id || bookingObj.id,
      client: bookingObj.client,
      handyman: bookingObj.handyman,
      serviceName: bookingObj.serviceName,
      price: bookingObj.price,
      status: bookingObj.status,
      bookingDate: bookingObj.bookingDate,
      address: bookingObj.address,
      isActive: bookingObj.isActive,
      isDeleted: bookingObj.isDeleted,
      createdAt: bookingObj.createdAt,
      updatedAt: bookingObj.updatedAt,
    };
  }

  static toDTOs(bookings) {
    if (!bookings) return [];
    return bookings.map(this.toDTO);
  }
}
