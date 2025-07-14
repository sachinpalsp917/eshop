import { Router } from "express";
import {
  loginUser,
  refreshUser,
  registerHandler,
  verifyUser,
} from "../controller/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/verify", verifyUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/refresh", refreshUser);

export default authRoutes;
