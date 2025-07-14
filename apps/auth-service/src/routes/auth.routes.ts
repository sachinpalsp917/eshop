import { Router } from "express";
import {
  loginUser,
  registerHandler,
  verifyUser,
} from "../controller/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/verify", verifyUser);
authRoutes.post("/login", loginUser);

export default authRoutes;
