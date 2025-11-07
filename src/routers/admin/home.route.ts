import express from "express";
import AdminHomeController from "../../controller/admin/home.controller";
const homeRoute = express.Router();


homeRoute.get("", AdminHomeController.getHomeAdminPage);
export default homeRoute;
