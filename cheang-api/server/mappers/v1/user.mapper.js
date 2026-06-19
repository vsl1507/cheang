export class UserMapper {
  static toDTO(user) {
    if (!user) return null;
    const userObj = user.toObject ? user.toObject() : { ...user };
    
    // Strip sensitive fields
    const { password, refreshTokens, ...dto } = userObj;
    
    dto.id = userObj._id || userObj.id;
    
    // Format nested roles/permissions if populated
    if (dto.role && typeof dto.role === "object") {
      dto.role = {
        id: dto.role._id || dto.role.id,
        name: dto.role.name,
        description: dto.role.description,
        permissions: Array.isArray(dto.role.permissions)
          ? dto.role.permissions.map(p => typeof p === "object" ? { id: p._id || p.id, name: p.name, description: p.description } : p)
          : dto.role.permissions
      };
    }

    return dto;
  }

  static toDTOs(users) {
    if (!users) return [];
    return users.map(u => this.toDTO(u));
  }
}
