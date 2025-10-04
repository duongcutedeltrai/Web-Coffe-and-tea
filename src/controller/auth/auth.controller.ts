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
  async getForgotPasswordPage(req: Request, res: Response) {
    return res.render("client/signIn_signUp_forgotPW.ejs", {
      show: "forgot-password",
    });
  }
  async getResetPasswordPage(req: Request, res: Response) {
    try {
      const { token } = req.query;
      const user = await AuthService.validateResetToken(token as string);
      return res.render("client/resetPassword.ejs", { token, user });
    } catch (error) {
      console.error("Reset password page error:", error.message);
      return res.render("client/404_page.ejs");
    }
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
      const user = await AuthService.register(newUser);
      return res.redirect("/auth/login");
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
      await AuthService.forgotPassword(email);
      return res.send(
        `<div>Chúng tôi đã gửi một email hướng dẫn đặt lại mật khẩu. </div>
        <div>Vui lòng kiểm tra hộp thư đến (và cả thư rác) để tiếp tục.</div>`
      );
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
      await AuthService.resetPassword(newPassword, token);
      return res.redirect("/auth/login");
    } catch (error) {
      console.error("Reset password error:", error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}
export default new AuthController();
