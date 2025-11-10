import express, { Express } from "express";

import { productRoute, productRouteAPI } from "./admin/product.route";

import authRoute from "./auth/auth.route";

const router = express.Router();
import categoryRoute from "./admin/category.route";
import userRoute from "./admin/user.route";
import homeRoute from "./admin/home.route";
import { orderRoute, orderDataRoute } from "./admin/order.route";
import { promotionDataRoute, promotionRoute } from "./admin/promotion.route";
import { blogRoute, blogDataRoute } from "./admin/blog.route";

const webRouter = (app: Express) => {
  app.use("/admin", productRoute);
  app.use("/api/admin", productRouteAPI);
  app.use("/admin", categoryRoute);
  app.use("/admin", userRoute);
  app.use("/", homeRoute);
  app.use("/admin", orderRoute);
  app.use("/admin", orderDataRoute);

  app.use("/auth", authRoute);
  app.use("/admin", promotionDataRoute);
  app.use("/admin", promotionRoute);
  app.use("/admin", blogRoute);
  app.use("/admin", blogDataRoute);
};

export default webRouter;
