import express from "express";
import { register } from "../controllers/userControler.js";

const userRouter = express.Router();

userRouter.post("/register", register);

export default userRouter;
