import { prisma } from "../../config/client";
import bcrypt from "bcrypt";
import { createJWT } from "../createJWT.service";
import crypto from "crypto";
import { mailService } from "../mail.service";

class AuthService {
  async login(email: string, password: string) {
    try {
      const userCurrent = await prisma.users.findUnique({
        where: { email: email },
      });
      if (!userCurrent) {
        throw new Error("Email incorrect!");
      }
      const pass = await bcrypt.compare(password, userCurrent.password);
      if (!pass) throw new Error("Password incorrect!");
      const token = createJWT(userCurrent);
      return token;
    } catch (error) {
      console.error("Error in service login:", error.message);
      throw error;
    }
  }
  async register(data: any) {
    try {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      const check = await prisma.users.findUnique({
        where: {
          email: data.email,
        },
      });
      console.log("Check existing user:", check);
      if (check) {
        throw new Error("Email đã tồn tại trong hệ thống!");
      } else {
        const user = await prisma.users.create({
          data: {
            email: data.email,
            username: data.username,
            password: data.password,
            phone: null,
            role_id: 3,
          },
        });
        return user;
      }
    } catch (error) {
      console.error("Error in service register:", error.message);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });
      if (!user) throw new Error("User not found");

      const token = crypto.randomBytes(32).toString("hex");
      await prisma.users.update({
        where: { email: user.email },
        data: {
          reset_token: token,
          reset_token_expire: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      await mailService.sendMail(
        email,
        "Click the link to reset your password",
        `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Reset Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                    <tr>
                      <td align="center" style="background:rgb(64, 34, 4); padding:20px;">
                        <h1 style="color:#ffffff; margin:0;">Reset Password</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">
                        <p>Xin chào,</p>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng bấm vào nút bên dưới để tiếp tục:</p>
                        <p style="text-align:center; margin:30px 0;">
                          <a href="http://localhost:3000/auth/reset-password?token=${token}"
                            style="background:rgb(64, 34, 4); color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; display:inline-block;">
                            Đặt lại mật khẩu
                          </a>
                        </p>
                        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                        <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background:#f0f0f0; padding:15px; font-size:12px; color:#777;">
                        © 2025 Your Company. All rights reserved.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>`,
        true
      );
      return token;
    } catch (error) {
      console.error("Error in service forgotPassword:", error.message);
      throw error;
    }
  }

  async validateResetToken(token: string) {
    const user = await prisma.users.findFirst({
      where: { reset_token: token },
    });

    if (!user) throw new Error("Invalid reset token");
    if (user.reset_token_expire.getTime() < Date.now())
      throw new Error("Token expired");
    return user;
  }
  async resetPassword(newPassword: string, token: string) {
    try {
      const user = await this.validateResetToken(token);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await prisma.users.update({
        where: { user_id: user.user_id },
        data: {
          password: hashed,
          reset_token: null,
          reset_token_expire: null,
        },
      });
    } catch (error) {
      console.error("Error in service resetPassword:", error.message);
      throw error;
    }
  }
}
export default new AuthService();