
import express from "express";
import AdminStatisticsController from "../../controller/admin/statistics.controller";
import { authMiddleware, roleMiddleware, authAndRoleMiddleware, adminStaffGuard } from "../../middleware/auth.middleware";

const statisticsRouter = express.Router();

statisticsRouter.get(
    "/statistics",
    authAndRoleMiddleware, adminStaffGuard,
    AdminStatisticsController.getStatisticsPage
);
statisticsRouter.get(
    "/statistics/api",
    AdminStatisticsController.getStatistics
);

statisticsRouter.get(
    "/statistics/products/:id",
    AdminStatisticsController.getStatisticsDetailProduct
);


export default statisticsRouter;
