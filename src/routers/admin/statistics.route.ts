
import express from "express";
import AdminStatisticsController from "../../controller/admin/statistics.controller";
const statisticsRouter = express.Router();

statisticsRouter.get(
    "/statistics",
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
