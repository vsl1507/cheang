export class NotificationMapper {
  static toDTO(notif) {
    if (!notif) return null;
    const notifObj = notif.toObject ? notif.toObject() : { ...notif };
    return {
      id: notifObj._id || notifObj.id,
      recipient: notifObj.recipient,
      sender: notifObj.sender,
      title: notifObj.title,
      message: notifObj.message,
      type: notifObj.type,
      isRead: notifObj.isRead,
      readAt: notifObj.readAt,
      targetModel: notifObj.targetModel,
      targetId: notifObj.targetId,
      createdAt: notifObj.createdAt,
      updatedAt: notifObj.updatedAt,
    };
  }

  static toDTOs(notifs) {
    if (!notifs) return [];
    return notifs.map(this.toDTO);
  }
}
