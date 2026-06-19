export class ReviewMapper {
  static toDTO(review) {
    if (!review) return null;
    const reviewObj = review.toObject ? review.toObject() : { ...review };
    return {
      id: reviewObj._id || reviewObj.id,
      client: reviewObj.client,
      handyman: reviewObj.handyman,
      rating: reviewObj.rating,
      comment: reviewObj.comment,
      createdAt: reviewObj.createdAt,
      updatedAt: reviewObj.updatedAt,
    };
  }

  static toDTOs(reviews) {
    if (!reviews) return [];
    return reviews.map(this.toDTO);
  }
}
