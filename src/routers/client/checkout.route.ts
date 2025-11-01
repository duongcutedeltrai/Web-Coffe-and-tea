import express from "express";
import cartController from "../../controller/client/cart.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const cartRouteAPI = express.Router();
cartRouteAPI.get("/cart", authMiddleware, cartController.getCartAPI);
cartRouteAPI.post("/cart", authMiddleware, cartController.addProductToCartAPI);
cartRouteAPI.put(
    "/cart/:cartDetailId",
    authMiddleware,
    cartController.updateCartAPI
);
cartRouteAPI.delete("/cart/:cartDetailId", cartController.deleteCartAPI);

export default cartRouteAPI;
