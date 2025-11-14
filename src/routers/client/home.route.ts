import express from "express";
// import { fileUploadUserMiddleware } from "../../middleware/multer";
import ClientHomeController from "../../controller/client/home.controller";
import {
    authMiddleware,
    roleMiddleware,
} from "../../middleware/auth.middleware";
const ClientHomeRouter = express.Router();

ClientHomeRouter.get(
    "/home",
    authMiddleware,
    ClientHomeController.getHomeClientPage
);
ClientHomeRouter.get(
    "/cart",
    authMiddleware,
    ClientHomeController.getCartClientPage
);
ClientHomeRouter.get(
    "/checkout",
    authMiddleware,
    ClientHomeController.getCheckoutPage
);
ClientHomeRouter.get(
    "/chat",
    authMiddleware,
    ClientHomeController.getChatClientPage
);
ClientHomeRouter.get(
    "/menu",
    authMiddleware,
    ClientHomeController.getMenuClientPage
);
ClientHomeRouter.get(
    "/favorite",
    authMiddleware,
    ClientHomeController.getFavoritesClientPage
);
ClientHomeRouter.get(
    "/products/:id",
    authMiddleware,
    ClientHomeController.getProductDetailPage
);
export { ClientHomeRouter };
