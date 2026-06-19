export class CategoryMapper {
  static toDTO(category) {
    if (!category) return null;
    const categoryObj = category.toObject ? category.toObject() : { ...category };
    return {
      id: categoryObj._id || categoryObj.id,
      nameEn: categoryObj.nameEn,
      nameKh: categoryObj.nameKh,
      nameZh: categoryObj.nameZh,
      description: categoryObj.description,
      isActive: categoryObj.isActive,
      isDeleted: categoryObj.isDeleted,
      createdBy: categoryObj.createdBy,
      updatedBy: categoryObj.updatedBy,
      createdAt: categoryObj.createdAt,
      updatedAt: categoryObj.updatedAt,
    };
  }

  static toDTOs(categories) {
    if (!categories) return [];
    return categories.map(this.toDTO);
  }
}
