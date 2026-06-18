import BasicService from "../../basic.service.js";
import Role from "../../../models/v1/auth/role.model.js";

class RoleService extends BasicService {
  constructor() {
    super(Role);
  }
}

export default RoleService;
