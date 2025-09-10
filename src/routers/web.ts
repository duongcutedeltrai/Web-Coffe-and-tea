import express, { Express } from "express";
import { getViewDetailProductPage } from "../controller/admin/product.controller";
import { getDashboardPage } from "../controller/admin/dashboard.controller";
const router = express.Router();

const webRouter = (app: Express) => {
    //dashboard
    app.get("/admin", getDashboardPage)

    //product
    app.get("/admin/detail-product", getViewDetailProductPage);

    app.use("/", router);
};

export default webRouter;
