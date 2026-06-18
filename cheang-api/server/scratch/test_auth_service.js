import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import AuthService from "../services/v1/auth/auth.service.js";
import ActivityLogService from "../services/v1/activityLog.service.js";

// Use Google Public DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const MONGO_URI = process.env.MONGO || "mongodb+srv://visaljudan:visal12345@visaljudan.alyvn.mongodb.net/cheang";

async function runAuthTest() {
  console.log("--------------------------------------------------");
  console.log("Connecting to database...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  const authService = new AuthService();
  const activityLogService = new ActivityLogService();

  const rand = Date.now();
  const testUserEmail = `testuser_${rand}@cheang.com`;
  const testUsername = `Test Auth User ${rand}`;
  const testPassword = "SuperSecretPassword123";
  let createdUserId = null;
  let testRefreshToken = null;

  try {
    // 1. Sign Up Test
    console.log(`\n1. Running AuthService.signup for ${testUserEmail}...`);
    const signupResult = await authService.signup({
      nameuser: testUsername,
      email: testUserEmail,
      password: testPassword,
    });

    if (!signupResult.success) {
      throw new Error(`Signup failed: ${signupResult.error}`);
    }

    createdUserId = signupResult.data._id;
    console.log(`SUCCESS: User signed up with ID: ${createdUserId}`);

    // Verify activity log creation for signup
    console.log("\n2. Checking ActivityLog for CREATE user event...");
    const signupLogs = await activityLogService.getAll({
      targetModel: "User",
      targetId: createdUserId,
      action: "CREATE",
    });

    if (signupLogs.success && signupLogs.data.items.length > 0) {
      console.log(`SUCCESS: Activity log found! Description: "${signupLogs.data.items[0].description}"`);
    } else {
      throw new Error("User creation activity log not found!");
    }

    // 3. Duplicate Sign Up Failure Test
    console.log("\n3. Testing duplicate signup rejection...");
    const dupSignupResult = await authService.signup({
      nameuser: testUsername,
      email: testUserEmail,
      password: testPassword,
    });

    if (!dupSignupResult.success && dupSignupResult.code === "DUPLICATE_ERROR") {
      console.log(`SUCCESS: Correctly rejected duplicate email with code: ${dupSignupResult.code}`);
    } else {
      throw new Error("Duplicate signup did not fail as expected!");
    }

    // 4. Sign In Wrong Password Test
    console.log("\n4. Testing signin with wrong password...");
    const wrongSignin = await authService.signin(testUserEmail, "WrongPasswordHere");
    if (!wrongSignin.success && wrongSignin.code === "UNAUTHORIZED") {
      console.log(`SUCCESS: Correctly rejected invalid credentials with code: ${wrongSignin.code}`);
    } else {
      throw new Error("Signin with invalid credentials did not fail as expected!");
    }

    // 5. Sign In Success Test
    console.log("\n5. Testing successful signin...");
    const signinResult = await authService.signin(testUserEmail, testPassword);
    if (!signinResult.success) {
      throw new Error(`Signin failed: ${signinResult.error}`);
    }

    const { accessToken, refreshToken, user } = signinResult.data;
    testRefreshToken = refreshToken;
    console.log("SUCCESS: User authenticated successfully!");
    console.log(`- Access Token generated (starts with): ${accessToken.substring(0, 20)}...`);
    console.log(`- Refresh Token generated (starts with): ${refreshToken.substring(0, 20)}...`);
    console.log(`- Authenticated User details: name=${user.nameuser}, email=${user.email}`);

    // Verify LOGIN log entry
    console.log("\n6. Checking ActivityLog for LOGIN event...");
    const loginLogs = await activityLogService.getAll({
      targetModel: "User",
      targetId: createdUserId,
      action: "LOGIN",
    });

    if (loginLogs.success && loginLogs.data.items.length > 0) {
      console.log(`SUCCESS: Login log entry found: "${loginLogs.data.items[0].description}"`);
    } else {
      throw new Error("Login activity log entry not found!");
    }

    // 7. Refresh Token Test
    console.log("\n7. Testing Token Refresh...");
    const refreshResult = await authService.refreshToken(testRefreshToken);
    if (!refreshResult.success) {
      throw new Error(`Token refresh failed: ${refreshResult.error}`);
    }

    const newAccessToken = refreshResult.data.accessToken;
    const newRefreshToken = refreshResult.data.refreshToken;
    console.log("SUCCESS: Tokens rotated successfully!");
    console.log(`- New Access Token (starts with): ${newAccessToken.substring(0, 20)}...`);
    console.log(`- New Refresh Token (starts with): ${newRefreshToken.substring(0, 20)}...`);

    // Verify refresh token is rotated in database
    const dbUser = await authService.model.findById(createdUserId);
    if (dbUser.refreshToken === newRefreshToken) {
      console.log("SUCCESS: Rotated refresh token is correctly stored on the User document in DB.");
    } else {
      throw new Error("Rotated refresh token does not match the database User record!");
    }

    // 8. Profile retrieval test
    console.log("\n8. Testing Profile Retrieval (myprofile)...");
    const profileResult = await authService.myprofile(createdUserId);
    if (!profileResult.success) {
      throw new Error(`Profile retrieval failed: ${profileResult.error}`);
    }

    const profile = profileResult.data;
    console.log("SUCCESS: Profile retrieved successfully!");
    console.log(`- Profile object email: ${profile.email}`);
    console.log(`- Password field omitted: ${profile.password === undefined}`);
    console.log(`- Refresh Token field omitted: ${profile.refreshToken === undefined}`);
    
    if (profile.role && profile.role.name) {
      console.log(`- Populated Role Details: name="${profile.role.name}", permissions count=${profile.role.permissions?.length || 0}`);
    } else {
      throw new Error("User profile did not populate the user's database role!");
    }

  } catch (error) {
    console.error("\nAUTH TEST RUN FAILED:", error);
  } finally {
    console.log("\n--------------------------------------------------");
    console.log("Cleaning up test records...");
    if (createdUserId) {
      const User = (await import("../models/user.model.js")).default;
      const ActivityLog = (await import("../models/v1/activityLog.model.js")).default;
      await User.findByIdAndDelete(createdUserId);
      await ActivityLog.deleteMany({ targetId: createdUserId });
      console.log("- Test user and associated logs cleaned up.");
    }
    await mongoose.connection.close();
    console.log("Database connection closed.");
    console.log("Auth test finished!");
    console.log("--------------------------------------------------");
  }
}

runAuthTest();
