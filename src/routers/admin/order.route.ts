import orderController from "../../controller/admin/order.controller";
import express from "express";
const orderRoute = express.Router();
const orderDataRoute = express.Router();
import { authMiddleware, roleMiddleware, authAndRoleMiddleware, adminStaffGuard } from "../../middleware/auth.middleware";

//render orders page
orderRoute.get("/orders", authAndRoleMiddleware, adminStaffGuard, orderController.getOrdersPage);
orderRoute.get("/orders/:id", authAndRoleMiddleware, adminStaffGuard, orderController.getOrdersPage);
orderRoute.get("/orders/create", authAndRoleMiddleware, adminStaffGuard, orderController.getOrdersPage);
//get data orders
orderDataRoute.get("/data/orders", orderController.getOrdersData);
orderDataRoute.get("/data/orders/:id", orderController.getOrderById);
orderDataRoute.post("/data/orders/create", orderController.createOrder);

orderRoute.put("/orders/:id/status", orderController.updateOrderStatus);

export { orderRoute, orderDataRoute };
