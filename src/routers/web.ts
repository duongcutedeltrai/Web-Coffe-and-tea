import express, { Express } from "express";
import { getDashboardPage } from "../controller/admin/dashboard.controller";
const router = express.Router();

const webRouter = (app: Express) => {
    app.get("/admin", getDashboardPage);

    app.use("/", router);
};

export default webRouter;
