import express, { Express } from "express";

import { productRoute, productRouteAPI } from "./admin/product.route";

import authRoute from "./auth.route";

const router = express.Router();
import categoryRoute from "./admin/category.route";
import userRoute from "./admin/user.route";
import homeRouter from "./admin/home.route";

const webRouter = (app: Express) => {
  app.use("/admin", productRoute);
  app.use("/api/admin", productRouteAPI);
  app.use("/admin", categoryRoute);
  app.use("/admin", userRoute);
  app.use("/", homeRouter);
  // app.use("/api/admin", categoryRouteAPI);
  // app.use("/", router);

  app.use("/auth", authRoute);
};

export default webRouter;
