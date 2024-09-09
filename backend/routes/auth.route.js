import { Router } from "express";
import { signup, verifyEmail , logout, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";


export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/logout", logout);
authRouter.post("/login", login);
 authRouter.post("/forgot-password", forgotPassword);
  authRouter.post("/reset-password/:token", resetPassword);