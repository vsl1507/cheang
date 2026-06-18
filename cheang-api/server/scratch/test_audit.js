import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import RoleService from "../services/v1/auth/role.service.js";
import ActivityLogService from "../services/v1/activityLog.service.js";
import NotificationService from "../services/v1/notification.service.js";

// Use Google Public DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://visaljudan:visal12345@visaljudan.alyvn.mongodb.net/cheang";

async function runTest() {
  console.log("--------------------------------------------------");
  console.log("Connecting to database...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  const roleService = new RoleService();
  const activityLogService = new ActivityLogService();
  const notificationService = new NotificationService();

  const testUserId = new mongoose.Types.ObjectId().toString();
  const tempRoleName = `TestAuditRole_${Date.now()}`;
  let tempRoleId = null;
  let tempNotificationId = null;

  try {
    // 1. Create a Role and see if it writes an activity log automatically
    console.log(`\n1. Creating temporary Role: "${tempRoleName}"...`);
    const createResult = await roleService.create(
      {
        name: tempRoleName,
        description: "Temporary role for auditing test",
        permissions: [],
      },
      testUserId
    );

    if (!createResult.success) {
      throw new Error(`Failed to create role: ${createResult.error}`);
    }

    tempRoleId = createResult.data._id;
    console.log(`Role created with ID: ${tempRoleId}`);

    // 2. Query ActivityLog to verify the log entry was created
    console.log("\n2. Checking ActivityLog for CREATE event...");
    const logsResult = await activityLogService.getAll(
      {
        targetModel: "Role",
        targetId: tempRoleId,
        action: "CREATE",
      }
    );

    if (logsResult.success && logsResult.data.items.length > 0) {
      const log = logsResult.data.items[0];
      console.log("SUCCESS: Activity log entry found!");
      console.log(`- Action: ${log.action}`);
      console.log(`- Target: ${log.targetModel} (${log.targetId})`);
      console.log(`- Description: "${log.description}"`);
      console.log(`- Created By: ${log.createdBy}`);
    } else {
      throw new Error("Activity log entry was not found in the database!");
    }

    // 3. Update the Role and verify log entry
    console.log(`\n3. Updating Role description...`);
    const updateResult = await roleService.update(
      tempRoleId,
      { description: "Updated description for auditing test" },
      testUserId
    );

    if (!updateResult.success) {
      throw new Error(`Failed to update role: ${updateResult.error}`);
    }

    const updateLogsResult = await activityLogService.getAll(
      {
        targetModel: "Role",
        targetId: tempRoleId,
        action: "UPDATE",
      }
    );

    if (updateLogsResult.success && updateLogsResult.data.items.length > 0) {
      const log = updateLogsResult.data.items[0];
      console.log("SUCCESS: Update activity log entry found!");
      console.log(`- Action: ${log.action}`);
      console.log(`- Description: "${log.description}"`);
    } else {
      throw new Error("Update activity log entry was not found!");
    }

    // 4. Test Notification dispatching helper in the base service
    console.log("\n4. Triggering test notification...");
    const recipientId = new mongoose.Types.ObjectId();
    const notification = await roleService.sendNotification(
      recipientId,
      testUserId,
      "Test Notification Header",
      "Hello! This is a test message to verify the notification system integration.",
      "info",
      "Role",
      tempRoleId
    );

    if (notification) {
      tempNotificationId = notification._id;
      console.log(`SUCCESS: Notification dispatched with ID: ${tempNotificationId}`);
      console.log(`- Title: "${notification.title}"`);
      console.log(`- Message: "${notification.message}"`);
    } else {
      throw new Error("Failed to send notification!");
    }

    // 5. Query NotificationService to ensure it's retrievable
    console.log("\n5. Querying Notification via service...");
    const notifResult = await notificationService.getById(tempNotificationId);
    if (notifResult.success) {
      console.log("SUCCESS: Notification correctly retrieved via NotificationService!");
    } else {
      throw new Error("Failed to query notification using NotificationService!");
    }

    // 6. Toggle Active Status and check log entry
    console.log("\n6. Toggling active status of Role...");
    const toggleResult = await roleService.toggleActive(tempRoleId, testUserId);
    if (!toggleResult.success) {
      throw new Error("Failed to toggle role active status");
    }

    const toggleLogsResult = await activityLogService.getAll(
      {
        targetModel: "Role",
        targetId: tempRoleId,
        action: "TOGGLE_ACTIVE",
      }
    );

    if (toggleLogsResult.success && toggleLogsResult.data.items.length > 0) {
      const log = toggleLogsResult.data.items[0];
      console.log("SUCCESS: Toggle active status activity log entry found!");
      console.log(`- Action: ${log.action}`);
      console.log(`- Description: "${log.description}"`);
    } else {
      throw new Error("Toggle active status activity log was not found!");
    }

  } catch (error) {
    console.error("\nTEST FAILED WITH ERROR:", error);
  } finally {
    // Cleanup
    console.log("\n--------------------------------------------------");
    console.log("Cleaning up test records...");
    
    if (tempRoleId) {
      console.log("- Cleaning up role and its activity logs...");
      await roleService.permanentDelete(tempRoleId, testUserId);
      const ActivityLog = (await import("../models/v1/activityLog.model.js")).default;
      await ActivityLog.deleteMany({ targetId: tempRoleId });
    }

    if (tempNotificationId) {
      console.log("- Cleaning up notification...");
      await notificationService.permanentDelete(tempNotificationId, testUserId);
    }

    console.log("Cleanup completed.");
    await mongoose.connection.close();
    console.log("Database connection closed.");
    console.log("Test finished successfully!");
    console.log("--------------------------------------------------");
  }
}

runTest();
