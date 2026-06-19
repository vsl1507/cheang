export class SupportMessageMapper {
  static toDTO(supportMessage) {
    if (!supportMessage) return null;
    const supportObj = supportMessage.toObject ? supportMessage.toObject() : { ...supportMessage };
    return {
      id: supportObj._id || supportObj.id,
      name: supportObj.name,
      email: supportObj.email,
      topic: supportObj.topic,
      message: supportObj.message,
      status: supportObj.status,
      isActive: supportObj.isActive,
      isDeleted: supportObj.isDeleted,
      createdAt: supportObj.createdAt,
      updatedAt: supportObj.updatedAt,
    };
  }

  static toDTOs(messages) {
    if (!messages) return [];
    return messages.map(this.toDTO);
  }
}
