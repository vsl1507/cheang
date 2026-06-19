import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import serviceController from "../controllers/v1/service.controller.js";

const serviceRouter = express.Router();

serviceRouter.post("/create", verifyToken, serviceController.create);
serviceRouter.delete("/delete/:id", verifyToken, serviceController.delete);
serviceRouter.post("/update/:id", verifyToken, serviceController.update);
serviceRouter.get("/get/:id", serviceController.getById);

export default serviceRouter;
