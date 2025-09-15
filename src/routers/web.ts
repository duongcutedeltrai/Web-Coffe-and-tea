import express, { Express } from "express";
import { getDetailProductPage, getProductsPage } from "../controller/admin/dashboard.controller";
import { getUserAdminPage, getViewDetailCustomerAdminPage, getViewDetailStaffAdminPage, postCreateUser, postDeleteUser } from "../controller/admin/user.controller";
import fileUploadMiddleware from "../middleware/multer";
const router = express.Router();

const webRouter = (app: Express) => {
    app.get("/admin/detail_product", getDetailProductPage);
    app.get("/admin/products", getProductsPage);

    // admin user
    app.get("/admin/user", getUserAdminPage)
    app.post("/admin/create-user", fileUploadMiddleware("avatar", "images/users"), postCreateUser)
    app.post("/admin/delete-user/:id", postDeleteUser)
    app.get("/admin/user/customer-detail/:id", getViewDetailCustomerAdminPage)
    app.get("/admin/user/staff-detail/", getViewDetailStaffAdminPage)

    app.use("/", router);
};

export default webRouter;
