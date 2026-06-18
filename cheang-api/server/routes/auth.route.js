import express from "express";
import {
  google,
  signin,
  signout,
  signup,
  refreshToken,
  myprofile,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);
authRouter.get("/signout", signout);
authRouter.post("/refresh-token", refreshToken);
authRouter.get("/myprofile", verifyToken, myprofile);

export default authRouter;
