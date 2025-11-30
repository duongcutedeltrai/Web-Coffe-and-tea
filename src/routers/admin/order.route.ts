import orderController from "../../controller/admin/order.controller";
import {
    authMiddleware,
    roleMiddleware,
    authAndRoleMiddleware,
    adminStaffGuard,
} from "../../middleware/auth.middleware";
import express from "express";
const orderRoute = express.Router();
const orderDataRoute = express.Router();
//render orders page
orderRoute.get("/orders", authAndRoleMiddleware,
    adminStaffGuard, orderController.getOrdersPage);
orderRoute.get("/orders/:id", orderController.getOrdersPage);
orderRoute.get("/orders/create", orderController.getOrdersPage);

//get data orders
orderDataRoute.get("/data/orders", orderController.getOrdersData);
orderDataRoute.get("/data/orders-user", authMiddleware, orderController.getOrderUsersData);
orderDataRoute.get("/data/orders/:id", orderController.getOrderById);
orderDataRoute.post("/data/orders/create", orderController.createOrder);

orderRoute.put("/orders/:id/status", orderController.updateOrderStatus);
orderRoute.get("/order/:id/pdf", orderController.getOrderPdf);

export { orderRoute, orderDataRoute };