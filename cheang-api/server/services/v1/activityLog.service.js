import BasicService from "../basic.service.js";
import ActivityLog from "../../models/v1/activityLog.model.js";

class ActivityLogService extends BasicService {
  constructor() {
    super(ActivityLog, { enableLogging: false });
  }
}

export default ActivityLogService;
