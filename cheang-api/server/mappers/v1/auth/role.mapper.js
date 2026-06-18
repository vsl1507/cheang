import { PermissionMapper } from "./permission.mapper.js";

export class RoleMapper {
  static toDTO(role) {
    if (!role) return null;
    return {
      id: role._id,
      name: role.name,
      description: role.description,
      permissions: role.permissions && role.permissions.length > 0 && typeof role.permissions[0] === 'object'
        ? PermissionMapper.toDTOs(role.permissions)
        : role.permissions,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }

  static toDTOs(roles) {
    if (!roles) return [];
    return roles.map(this.toDTO);
  }
}
