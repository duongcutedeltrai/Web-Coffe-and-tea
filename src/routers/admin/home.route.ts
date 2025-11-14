import express from "express";
import AdminHomeController from "../../controller/admin/home.controller";
import { authMiddleware, roleMiddleware, authAndRoleMiddleware, adminStaffGuard } from "../../middleware/auth.middleware";
const homeRoute = express.Router();


homeRoute.get("", adminStaffGuard, AdminHomeController.getHomeAdminPage);
export default homeRoute;
