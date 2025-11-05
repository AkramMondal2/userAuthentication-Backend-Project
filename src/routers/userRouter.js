import express from "express";
import { login, register } from "../controllers/userControler.js";
import { verification } from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/verifyToken", verification);
userRouter.post("/login", login);

export default userRouter;
