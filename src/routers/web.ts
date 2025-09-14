import express, { Express } from "express";
import AdminCategoryController from "../controller/admin/category.controller";
import {
    getDetailProductPage,
    getProductsPage,
} from "../controller/admin/dashboard.controller";
import categoryRoute from "./category.route";
const router = express.Router();

const webRouter = (app: Express) => {
    app.get("/admin/detail_product", getDetailProductPage);
    app.get("/admin/products", getProductsPage);
   // app.get("/admin/categories", AdminCategoryController.getCategoriesPage);
    app.use("/", router);
    app.use("/admin", categoryRoute);
};

export default webRouter;
