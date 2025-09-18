import { prisma } from "../../config/client";
import bcrypt from "bcrypt";
import { createJWT } from "../createJWT.service";
import crypto from "crypto";

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
      throw error;
    }
  }
  async register(data) {
    try {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      const user = await prisma.users.create({
        data: {
          email: data.email,
          username: data.username,
          password: data.password,
          phone: "",
          role_id: 2,
        },
      });
      return user;
    } catch (error) {
      console.error("Error:", error.message);
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
      // mailService.sendMail(
      //   "duc17kd@gmail.com",
      //   "TOKEN FOR FORGOT PASSWORD",
      //   token
      // );
      return token;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
  async resetPassword(newPassword: string, token: string) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          reset_token: token,
        },
      });
      console.log(user);
      if (!user) throw new Error("Invalid token");
      if (user.reset_token_expire.getTime() < Date.now())
        throw new Error("Token expired");

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
      //mailService.sendMail("duc17kd@gmail.com", "NEW PASSWORD", newPassword);
      return {
        message: "Password reset successfully",
        token,
      };
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}
export default new AuthService();
