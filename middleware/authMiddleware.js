import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  //   console.log(token);
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id).select("-password");
    // console.log("in authmid" + req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
export default authMiddleware;
