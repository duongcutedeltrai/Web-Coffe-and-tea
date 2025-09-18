import { Request, Response } from "express";
import AuthService from "../../services/auth/auth.service";

class AuthController {
  async getLoginPage(req: Request, res: Response) {
    return res.render("client/signIn_signUp_forgotPW.ejs", { show: "login" });
  }
  async getRegisterPage(req: Request, res: Response) {
    return res.render("client/signIn_signUp_forgotPW.ejs", {
      show: "register",
    });
  }
  async getHomePage(req: Request, res: Response) {
    const user = (req as any).user;
    console.log(user);
    return res.render("client/home.ejs", { user });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);

      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/auth/home");
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(401).render("client/signIn_signUp_forgotPW.ejs", {
        show: "login",
        error: error.message,
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };
      console.log(newUser);
      const user = await AuthService.register(newUser);
      return user;
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const token = await AuthService.forgotPassword(email);
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Forgot password error:", error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}
export default new AuthController();
