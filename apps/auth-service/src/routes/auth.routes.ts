import { Router } from "express";
import {
  forgotPasswordUser,
  loginUser,
  logoutUser,
  refreshUser,
  registerHandler,
  verifyUser,
} from "../controller/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/verify", verifyUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/refresh", refreshUser);
authRoutes.get("/logout", logoutUser);
authRoutes.post("/forgot-password", forgotPasswordUser);

export default authRoutes;
