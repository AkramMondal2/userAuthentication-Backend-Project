import userSchema from "../models/userSchema.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv/config"

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        sucess: true,
        message: "Authorization Token is missing or Invalide",
      });
    } else {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.message === "TokenExpiredError") {
            return res.status(400).json({
              sucess: false,
              message: "The Registation Token is Expire",
            });
          } else {
            return res.status(400).json({
              sucess: false,
              message: "Token Verifaction Failed, Possibaly Expire",
            });
          }
        } else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(404).json({
              sucess: false,
              message: "User Not Found",
            });
          } else {
            user.token = null;
            user.verified = true;
            await user.save();

            return res.status(200).json({
              sucess: true,
              message: "Email Verified Sucessfuly",
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Could Not Access",
    });
  }
};
