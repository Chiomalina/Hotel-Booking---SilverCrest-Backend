import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData)


export default userRouter;