export class PermissionMapper {
  static toDTO(permission) {
    if (!permission) return null;
    return {
      id: permission._id,
      name: permission.name,
      description: permission.description,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    };
  }

  static toDTOs(permissions) {
    if (!permissions) return [];
    return permissions.map(this.toDTO);
  }
}
