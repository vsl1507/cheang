import express from "express";
import userController from "../controllers/v1/user.controller.js";
import supportMessageController from "../controllers/v1/supportMessage.controller.js";
import serviceController from "../controllers/v1/service.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/support-message", supportMessageController.create);
userRouter.get("/test", (req, res) => res.status(201).json("User created successfully"));
userRouter.delete("/delete/:id", verifyToken, userController.delete);
userRouter.get("/services/:id", verifyToken, serviceController.getUserService);
userRouter.get("/getuser/:id", verifyToken, userController.getUser);
userRouter.get("/service/:id", serviceController.getServiceUser);
userRouter.get("/getuserno/:id", userController.getUser);

// With token
userRouter.get("/getalluserac/", verifyToken, userController.getAllUserAc);
userRouter.post("/update/:id", verifyToken, userController.update);
userRouter.post("/rating/:id", verifyToken, userController.ratingUser);
userRouter.post("/comment/:id", verifyToken, userController.commentUser);
userRouter.delete("/deletecomment/:commentId", verifyToken, userController.deleteCommentUser);
userRouter.post("/save/:userId", verifyToken, userController.saveUser);
userRouter.get("/search", verifyToken, userController.searchUsers);
userRouter.get("/live-search", userController.liveSearch);

// To admin
userRouter.post("/updateconfirm/:id", verifyToken, userController.update);
userRouter.get("/countusers", verifyToken, userController.getAllUser);

// Without token
userRouter.get("/getalluser/", userController.getAllUser);

export default userRouter;
