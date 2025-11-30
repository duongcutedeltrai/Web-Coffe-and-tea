import express from "express";
import AdminDashboardController from "../../controller/admin/dashboard.controller";
import {
    authMiddleware,
    roleMiddleware,
    authAndRoleMiddleware,
    adminStaffGuard,
} from "../../middleware/auth.middleware";
const DashboardRoute = express.Router();

DashboardRoute.get(
    "/dashboard",
    authAndRoleMiddleware,
    adminStaffGuard,
    AdminDashboardController.getDashboardAdminPage
);
export default DashboardRoute;
