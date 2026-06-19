import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dns from "dns";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import serviceRouter from "./routes/serivce.route.js";
import chatRouter from "./routes/chat.route.js";
import categoryRoutes from "./routes/v1/auth/category.route.js";
import permissionRoutes from "./routes/v1/auth/permission.route.js";
import roleRoutes from "./routes/v1/auth/role.route.js";
import userV1Routes from "./routes/v1/user.route.js";
import serviceV1Routes from "./routes/v1/service.route.js";
import bookingV1Routes from "./routes/v1/booking.route.js";
import supportMessageV1Routes from "./routes/v1/supportMessage.route.js";
import reviewV1Routes from "./routes/v1/review.route.js";
import saveV1Routes from "./routes/v1/save.route.js";
import chatV1Routes from "./routes/v1/chat.route.js";
import transactionV1Routes from "./routes/v1/transaction.route.js";
import notificationV1Routes from "./routes/v1/notification.route.js";
import { setupSwagger } from "./swagger.js";

// Use Google Public DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// import cors from "cors";
//Update
// import http from "http";
// import { Server } from "socket.io";
////
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to Mongo DB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Route
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/service", serviceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/users", userV1Routes);
app.use("/api/v1/services", serviceV1Routes);
app.use("/api/v1/bookings", bookingV1Routes);
app.use("/api/v1/support-messages", supportMessageV1Routes);
app.use("/api/v1/reviews", reviewV1Routes);
app.use("/api/v1/saves", saveV1Routes);
app.use("/api/v1/chat", chatV1Routes);
app.use("/api/v1/transactions", transactionV1Routes);
app.use("/api/v1/notifications", notificationV1Routes);


// Setup Swagger
setupSwagger(app);

//Render deploy
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//Middleware Error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
