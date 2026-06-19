export class ServiceMapper {
  static toDTO(service) {
    if (!service) return null;
    const serviceObj = service.toObject ? service.toObject() : { ...service };
    return {
      id: serviceObj._id || serviceObj.id,
      name: serviceObj.name,
      description: serviceObj.description,
      price: serviceObj.price,
      image: serviceObj.image,
      userRef: serviceObj.userRef,
      isActive: serviceObj.isActive,
      isDeleted: serviceObj.isDeleted,
      createdAt: serviceObj.createdAt,
      updatedAt: serviceObj.updatedAt,
    };
  }

  static toDTOs(services) {
    if (!services) return [];
    return services.map(this.toDTO);
  }
}
