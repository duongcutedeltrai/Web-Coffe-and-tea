import { Request, Response, NextFunction } from "express";
import { decodedJWT } from "../services/decodedJWT.service";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
  if (!token) {
    console.log("No token found");
    return res.redirect("/auth/login");
  }
  try {
    const decoded = decodedJWT(token);
    if (!decoded) {
      console.log("Invalid token");
      return res.redirect("/auth/login");
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    return res.redirect("/auth/login");
  }
}
// export const roleMiddleware =
//   (...roles: string[]) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       //return res.status(403).render("client/403.ejs", { message: "Permission denied" });

//       return res.status(403).json({ message: "Permission denied" });
//     }
//     next();
//   };
