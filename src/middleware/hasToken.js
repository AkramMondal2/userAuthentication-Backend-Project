import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";
import dotenv from "dotenv/config"

export const hasToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader && !authHeader.startsWith("Bearer")) {
      return res.status(400).json({
        sucess: false,
        messge: "Access token is missing or Invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.secretKey, async (err, decoded) => {
      if (err) {
        if (err.message === "TokenExpireError") {
          return res.status(400).json({
            sucess: false,
            messge: "AcessToken is expire Use refreshToken to generet again",
          });
        } else {
          return res.status(400).json({
            sucess: false,
            message: "Access token is missing or invalid",
          });
        }
      } else {
        const { id } = decoded;
        const user = await userSchema.findById(id);
        if (!user) {
          return res.status(404).json({
            sucess: false,
            message: "user not found",
          });
        }
        req.userId = id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Could not access h",
    });
  }
};
