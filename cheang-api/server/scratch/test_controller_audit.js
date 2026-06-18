import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import roleController from "../controllers/v1/auth/role.controller.js";
import ActivityLogService from "../services/v1/activityLog.service.js";

// Use Google Public DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://visaljudan:visal12345@visaljudan.alyvn.mongodb.net/cheang";

async function runControllerTest() {
  console.log("--------------------------------------------------");
  console.log("Connecting to database...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  const activityLogService = new ActivityLogService();

  // Test variables
  const mockUserId = "6a3373267d0134aec873fec4"; // mock authenticated user
  const tempRoleName = `CtrlAuditRole_${Date.now()}`;
  let tempRoleId = null;

  try {
    // 1. Mock Request/Response for Role Creation (overridden controller method)
    console.log(`\n1. Invoking roleController.create with user: ${mockUserId}...`);
    
    const reqCreate = {
      body: {
        name: tempRoleName,
        description: "Created via Controller Audit Test",
        permissions: [],
      },
      user: {
        id: mockUserId,
      },
    };

    let responseCode = null;
    let responseBody = null;

    const resMock = {
      status: function(code) {
        responseCode = code;
        return this;
      },
      json: function(data) {
        responseBody = data;
        return this;
      },
    };

    await roleController.create(reqCreate, resMock);

    if (responseCode !== 201 || !responseBody.success) {
      throw new Error(`Failed to create role via controller: ${JSON.stringify(responseBody)}`);
    }

    tempRoleId = responseBody.data.id || responseBody.data._id;
    console.log(`Role created successfully via controller. ID: ${tempRoleId}`);

    // Query ActivityLog to verify that the creator is the mockUserId
    console.log("\n2. Checking ActivityLog for CREATE event containing controller actor...");
    const createLogs = await activityLogService.getAll({
      targetModel: "Role",
      targetId: tempRoleId,
      action: "CREATE",
    });

    if (createLogs.success && createLogs.data.items.length > 0) {
      const log = createLogs.data.items[0];
      if (log.userId?.toString() === mockUserId) {
        console.log(`SUCCESS: Activity log contains the correct userId: ${log.userId}`);
      } else {
        throw new Error(`Activity log contains incorrect userId: ${log.userId} (expected: ${mockUserId})`);
      }
    } else {
      throw new Error("No CREATE activity log found!");
    }

    // 3. Mock Request/Response for Role toggleActive (inherited basic controller method)
    console.log(`\n3. Invoking roleController.toggleActive (inherited handler) with user: ${mockUserId}...`);
    
    const reqToggle = {
      params: {
        id: tempRoleId,
      },
      user: {
        id: mockUserId,
      },
    };

    let toggleCode = null;
    let toggleBody = null;

    const resToggleMock = {
      status: function(code) {
        toggleCode = code;
        return this;
      },
      json: function(data) {
        toggleBody = data;
        return this;
      },
    };

    await roleController.toggleActive(reqToggle, resToggleMock);

    if (toggleCode !== 200 || !toggleBody.success) {
      throw new Error(`Failed to toggle role via controller: ${JSON.stringify(toggleBody)}`);
    }

    console.log("Role toggled successfully.");

    // Query ActivityLog to verify that the actor is mockUserId and NOT 1
    console.log("\n4. Checking ActivityLog for TOGGLE_ACTIVE event containing controller actor...");
    const toggleLogs = await activityLogService.getAll({
      targetModel: "Role",
      targetId: tempRoleId,
      action: "TOGGLE_ACTIVE",
    });

    if (toggleLogs.success && toggleLogs.data.items.length > 0) {
      const log = toggleLogs.data.items[0];
      if (log.userId?.toString() === mockUserId) {
        console.log(`SUCCESS: Toggle active activity log contains correct userId: ${log.userId}`);
      } else {
        throw new Error(`Toggle active activity log contains incorrect userId: ${log.userId} (expected: ${mockUserId})`);
      }
    } else {
      throw new Error("No TOGGLE_ACTIVE activity log found!");
    }

  } catch (error) {
    console.error("\nCONTROLLER AUDIT TEST FAILED:", error);
  } finally {
    console.log("\n--------------------------------------------------");
    console.log("Cleaning up test records...");
    if (tempRoleId) {
      const Role = (await import("../models/v1/auth/role.model.js")).default;
      const ActivityLog = (await import("../models/v1/activityLog.model.js")).default;
      await Role.findByIdAndDelete(tempRoleId);
      await ActivityLog.deleteMany({ targetId: tempRoleId });
      console.log("- Role and associated logs cleaned up.");
    }
    await mongoose.connection.close();
    console.log("Database connection closed.");
    console.log("Controller test finished!");
    console.log("--------------------------------------------------");
  }
}

runControllerTest();
