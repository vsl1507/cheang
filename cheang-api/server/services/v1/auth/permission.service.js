import BasicService from "../../basic.service.js";
import Permission from "../../../models/v1/auth/permission.model.js";

class PermissionService extends BasicService {
  constructor() {
    super(Permission);
  }
}

export default PermissionService;
