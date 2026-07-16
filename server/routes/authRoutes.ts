import { Router } from "express";
import {
  loginUser,
  registerUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);

export default authRouter;
