import express from "express";
import AdminHomeController from "../../controller/admin/home.controller";
const homeRouter = express.Router();

homeRouter.get("", AdminHomeController.getHomeAdminPage);

export default homeRouter;
