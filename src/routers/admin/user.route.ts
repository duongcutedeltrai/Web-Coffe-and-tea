import express from "express";
import { fileUploadUserMiddleware } from "../../middleware/multer";
import AdminUserController from "../../controller/admin/user.controller";
const userRoute = express.Router();

userRoute.get("/customer", AdminUserController.getAdminCustomerPage);
userRoute.get("/staff", AdminUserController.getAdminStaffPage);
userRoute.post(
    "/create-user",
    fileUploadUserMiddleware("avatar"),
    AdminUserController.postCreateUser
);
userRoute.post("/customer/delete-customer/:id", AdminUserController.postDeleteCustomer);
userRoute.post("/staff/delete-staff/:id", AdminUserController.postDeleteStaff);

userRoute.post("/staff/lock-staff/:id", AdminUserController.postLockStaff)
userRoute.post("/staff/unlock-staff/:id", AdminUserController.postUnlockStaff)

userRoute.post("/customer/lock-customer/:id", AdminUserController.postLockCustomer)
userRoute.post("/customer/unlock-customer/:id", AdminUserController.postUnlockCustomer)

userRoute.post("/staff/update-staff", fileUploadUserMiddleware("avatar"), AdminUserController.postUpdateStaff)

userRoute.get(
    "/customer/customer-detail/:id",
    AdminUserController.getViewDetailCustomerAdminPage
);
userRoute.get(
    "/staff/detail_staff/:id",
    AdminUserController.getViewDetailStaffAdminPage
);

userRoute.get("/staff/search", AdminUserController.getSearchStaff)
userRoute.get("/customer/search", AdminUserController.getCustomerSearch)

userRoute.get("/staff-revenue", AdminUserController.getStaffRevenue);
userRoute.get("/staff-revenue/api", AdminUserController.getStaffRevenueAPI);



export default userRoute;
