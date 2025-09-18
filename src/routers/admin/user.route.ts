import express from "express";
import { fileUploadUserMiddleware } from "../../middleware/multer";
import AdminUserController from "../../controller/admin/user.controller";
const userRoute = express.Router();

userRoute.get("/user", AdminUserController.getUserAdminPage);
userRoute.post(
    "/create-user",
    fileUploadUserMiddleware("avatar"),
    AdminUserController.postCreateUser
);
userRoute.post("/delete-user/:id", AdminUserController.postDeleteUser);
userRoute.get(
    "/user/customer-detail/:id",
    AdminUserController.getViewDetailCustomerAdminPage
);
userRoute.get(
    "/user/staff-detail/:id",
    AdminUserController.getViewDetailStaffAdminPage
);

export default userRoute;
