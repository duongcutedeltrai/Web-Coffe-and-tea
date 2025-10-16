import express from "express";
import AuthController from "../../controller/auth/auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const authRoute = express.Router();

authRoute.get("/login", AuthController.getLoginPage);
authRoute.get("/register", AuthController.getRegisterPage);
authRoute.get("/home", authMiddleware, AuthController.getHomePage);
authRoute.get("/forgot-password", AuthController.getForgotPasswordPage);
authRoute.get("/reset-password", AuthController.getResetPasswordPage);

authRoute.post("/login", AuthController.login);
authRoute.post("/register", AuthController.register);
authRoute.get("/logout", AuthController.logout);
authRoute.post("/forgot-password", AuthController.forgotPassword);
authRoute.post("/reset-password", AuthController.resetPassword);

export default authRoute;
