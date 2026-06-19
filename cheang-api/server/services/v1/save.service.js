import BasicService from "../basic.service.js";
import Save from "../../models/v1/save.model.js";

class SaveService extends BasicService {
  constructor() {
    super(Save);
  }

  async getSavesBySaver(userSaver) {
    try {
      const saves = await this.model.find({ userSaver })
        .populate("userSaved", "nameuser avatar");
      return { success: true, data: saves };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async toggleSave(userSaver, userSaved) {
    try {
      const existingSave = await this.model.findOne({ userSaver, userSaved });
      if (existingSave) {
        await this.model.deleteOne({ _id: existingSave._id });
        return { success: true, data: null, action: "removed" };
      } else {
        const newSave = await this.model.create({
          userSaver,
          userSaved,
          saveSign: true,
        });
        return { success: true, data: newSave, action: "added" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default SaveService;
