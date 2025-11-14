import { Request, Response } from "express";
import AuthService from "../../services/auth/auth.service";
import userService from "../../services/user.service";
import { decodedJWT } from "../../services/decodedJWT.service";

class AuthController {
  async getLoginPage(req: Request, res: Response) {
    return res.render("auth/signIn_signUp_forgotPW.ejs", {
      show: "login",
      error: null,
      oldEmail: "",
    });
  }
  async getRegisterPage(req: Request, res: Response) {
    return res.render("auth/signIn_signUp_forgotPW.ejs", {
      show: "register",
      oldEmail: "",
      error: null,
    });
  }
  async getHomePage(req: Request, res: Response) {
    const user = await userService.getDetailCustomerById(
      +(req.user as any)?.id || 0
    );

    return res.render("client/home/home.ejs", { user });
  }
  async getForgotPasswordPage(req: Request, res: Response) {
    return res.render("auth/signIn_signUp_forgotPW.ejs", {
      show: "forgot-password",
      oldEmail: "",
      error: null,
    });
  }
  async getResetPasswordPage(req: Request, res: Response) {
    try {
      const { token } = req.query;
      const user = await AuthService.validateResetToken(token as string);
      return res.render("auth/resetPassword.ejs", { token, user });
    } catch (error) {
      console.error("Reset password page error:", error.message);
      return res.render("auth/404_page.ejs");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.cookie("token", token, { httpOnly: true });

      if (!token) {
        (req as any).user = null;
      }

      const decoded = decodedJWT(token);
      if (!decoded) {
        (req as any).user = null;
      }
      (req as any).user = decoded;

      if (req.user && (req.user as any).role === 1) {
        return res.redirect("/admin/customer");
      } else if (req.user && (req.user as any).role === 2) {
        return res.redirect("/admin/customer");
      } else {
        return res.redirect("/home");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(401).render("auth/signIn_signUp_forgotPW.ejs", {
        show: "login",
        error: error.message,
        oldEmail: req.body.email,
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      console.log(req.body);
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };
      const user = await AuthService.register(newUser);
      return res.redirect("/auth/login");
    } catch (error) {
      console.error("Register error:", error.message);
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
      return res.render("auth/signIn_signUp_forgotPW.ejs", {
        show: "forgot-password",
        oldEmail: "",
        errorReset: error.message,
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