import orderController from "../../controller/admin/order.controller";
import express from "express";
const orderRoute = express.Router();
const orderDataRoute = express.Router();
//render orders page
orderRoute.get("/orders", orderController.getOrdersPage);
orderRoute.get("/orders/:id", orderController.getOrdersPage);
orderRoute.get("/orders/create", orderController.getOrdersPage);

//get data orders
orderDataRoute.get("/data/orders", orderController.getOrdersData);
orderDataRoute.get("/data/orders/:id", orderController.getOrderById);
orderDataRoute.post("/data/orders/create", orderController.createOrder);

orderRoute.put("/orders/:id/status", orderController.updateOrderStatus);

export { orderRoute, orderDataRoute };
