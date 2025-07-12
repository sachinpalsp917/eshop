import { Router } from "express";
import { registerHandler, verifyUser } from "../controller/auth.controller";

const authRoutes: Router = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/verify-user", verifyUser);

export default authRoutes;
