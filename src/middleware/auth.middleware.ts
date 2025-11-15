import { Request, Response, NextFunction } from "express";
import { decodedJWT } from "../services/decodedJWT.service";
import {prisma} from "../config/client"
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;
    if (!token) {
        (req as any).user = null;
        return next();
    }
    try {
        const decoded = decodedJWT(token);
        if (!decoded) {
            (req as any).user = null;
            res.locals.userCurrent = null;
            return next();
        }
        const user= await prisma.users.findUnique({
            where: { user_id: decoded.id },
             select: {
      user_id: true,
      username: true,
      email: true,
      avatar: true,
      phone: true,
      address: true,
      gender: true,
      birthday: true,
      status: true,
      point: true,
      role_id: true,
      membership: true,
      discount_rate: true,
      // Nếu cần staff_detail thì select thêm
      staff_detail: true 
    }
        });
        if (!user) {
            (req as any).user = null;
            res.locals.userCurrent = null;
            return next();
        }
        (req as any).user = decoded;
        res.locals.userCurrent = user;
        next();
    } catch (err) {
        (req as any).user = null;
        next();
    }
}
export const roleMiddleware =
    (...roles: number[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).user) {
            return res.status(401).redirect("/auth/login");
        }
        if (!roles.includes((req as any).user.role)) {
            //return res.status(403).render("client/403.ejs", { message: "Permission denied" });
            return res.redirect("/auth/login");
        }
        next();
    };
