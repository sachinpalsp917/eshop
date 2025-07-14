import { Router } from "express";
import {
  forgotPasswordOtp,
  forgotPasswordUser,
  loginUser,
  logoutUser,
  refreshUser,
  registerHandler,
  resetUserPassword,
  verifyUser,
} from "../controller/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/verify", verifyUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/refresh", refreshUser);
authRoutes.get("/logout", logoutUser);
authRoutes.post("/forgot-password", forgotPasswordUser);
authRoutes.post("/verify-forgot-password", forgotPasswordOtp);
authRoutes.post("/reset-password", resetUserPassword);

export default authRoutes;
