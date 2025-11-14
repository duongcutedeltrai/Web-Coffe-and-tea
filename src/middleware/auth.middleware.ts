import { Request, Response, NextFunction } from "express";
import { decodedJWT } from "../services/decodedJWT.service";
import AdminUserService from "../services/user.service";

export function authMiddleware(
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
      return next();
    }
    (req as any).user = decoded;
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


export async function authAndRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
  let user = null;
  let roleId = null;

  if (token) {
    try {
      const decoded = decodedJWT(token);
      if (decoded?.id) {
        user = await AdminUserService.getDetailCustomerById(decoded.id);
        roleId = user?.role_id ?? null;
      }
    } catch (err) {
      user = null;
      roleId = null;
    }
  }

  (req as any).user = user;
  res.locals.user = user;
  res.locals.roleIdAuthor = roleId;
  res.locals.isAdmin = roleId === 1;
  res.locals.isStaff = roleId === 2;

  next();
}

export function adminStaffGuard(req: Request, res: Response, next: NextFunction) {
  const { isAdmin, isStaff } = res.locals;

  if (!isAdmin && !isStaff) {
    return res.redirect("/auth/login"); // redirect nếu không có quyền
  }
  next();
}
