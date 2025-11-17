import express from "express";
import { login, logOut, register } from "../controllers/userControler.js";
import { verification } from "../middleware/verifyToken.js";
import { hasToken } from "../middleware/hasToken.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/verifyToken", verification);
userRouter.post("/login", login);
userRouter.delete("/logout",hasToken,logOut);

export default userRouter;
