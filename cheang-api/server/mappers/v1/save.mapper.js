export class SaveMapper {
  static toDTO(save) {
    if (!save) return null;
    const saveObj = save.toObject ? save.toObject() : { ...save };
    return {
      id: saveObj._id || saveObj.id,
      userSaver: saveObj.userSaver,
      userSaved: saveObj.userSaved,
      saveSign: saveObj.saveSign,
      createdAt: saveObj.createdAt,
      updatedAt: saveObj.updatedAt,
    };
  }

  static toDTOs(saves) {
    if (!saves) return [];
    return saves.map(this.toDTO);
  }
}
