import User from "../models/User.js";
import { getAuth } from "@clerk/express";

// Middleware to chack if the user is authenticated
export const protect = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.json({ success: false, message: "not authenticated" });
  } else {
    const user = await User.findById(userId);
    req.user = user;
    next();
  }
};
