import express, { Express } from "express";
import {
    getDetailProductPage,
    getProductsPage,
} from "../controller/admin/dashboard.controller";
const router = express.Router();

const webRouter = (app: Express) => {
    app.get("/admin/detail_product", getDetailProductPage);
    app.get("/admin/products", getProductsPage);

    app.use("/", router);
};

export default webRouter;
