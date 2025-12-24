import express from "express";
import { fileUploadProductMiddleware } from "../../middleware/multer";
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

ClientHomeRouter.get(
  "/profile",
  authMiddleware,
  ClientHomeController.getProfileClientPage
);

ClientHomeRouter.get(
  "/data/user",
  authMiddleware,
  ClientHomeController.getDataOfUser
);

ClientHomeRouter.post(
  "/profile/update",
  authMiddleware,
  ClientHomeController.updateProfileClient
);
ClientHomeRouter.post(
  "/profile/upload-avatar",
  authMiddleware,
  fileUploadProductMiddleware("avatar", "images/users"),
  ClientHomeController.uploadAvatarClient
);
export { ClientHomeRouter };
