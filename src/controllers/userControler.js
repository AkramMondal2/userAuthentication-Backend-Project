import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyMail } from "../emailVerify/verifyMail.js";
import sessionSchema from "../models/sessionSchema.js";

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

    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });

    verifyMail(token, email);

    user.token = token;
    await user.save();

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        sucess: false,
        message: "Unauthorized Access",
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({
        sucess: false,
        message: "Invalide Password",
      });
    } else if (passwordCheck && user.verified === true) {
      await sessionSchema.findOneAndDelete({
        userId: user._id,
      });
      await sessionSchema.create({
        userId: user._id,
      });
      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.secretKey,
        {
          expiresIn: "10days",
        }
      );

      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.secretKey,
        {
          expiresIn: "30days",
        }
      );

      (user.isLoggedIn = true), await user.save();

      return res.status(200).json({
        sucess: true,
        message: "Loged In Sucessfuly",
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: user,
      });
    } else {
      return res.status(401).json({
        sucess: false,
        message: "Complete Email Verification Then Login...",
      });
    }
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const exiesting = await sessionSchema.findOne({ userId: req.userId });
    if (exiesting) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      await userSchema.findByIdAndUpdate(req.userId, { isLoggedIn: false });
      return res.status(200).json({
        sucess: true,
        message: "Session end sucessfuly",
      });
    } else {
      return res.status(400).json({
        sucess: false,
        message: "User does not have any session",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};
