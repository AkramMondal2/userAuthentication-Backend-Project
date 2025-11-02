import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { verifyMail } from "../emailVerify/verifyMail.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existing = await userSchema.findOne({
      email: email,
    });

    if (existing) {
      return res.status(401).json({
        sucess: false,
        message: "User Already exiest",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({id:user._id},process.env.secretKey,{
      expiresIn: "5m"
    })

    verifyMail(token,email)

    user.token = token
    await user.save()

    return res.status(200).json({
      sucess: true,
      message: "User Created Sucessfuly",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};
