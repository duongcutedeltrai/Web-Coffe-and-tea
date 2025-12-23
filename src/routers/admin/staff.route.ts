import express from "express";
import StaffController from "../../controller/staff/staff.controller";
import {
    authMiddleware,
    roleMiddleware,
    authAndRoleMiddleware,
    adminStaffGuard,
} from "../../middleware/auth.middleware";
const staffRoute = express.Router();

staffRoute.get(
    "/my-calendar",
    authAndRoleMiddleware,
    adminStaffGuard,
    StaffController.getCalendarPage
);
export default staffRoute;
