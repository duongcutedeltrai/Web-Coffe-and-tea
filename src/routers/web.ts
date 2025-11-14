import express, { Express } from "express";

import { Request, Response } from "express";

///admin
import { productRoute, productRouteAPI } from "./admin/product.route";
import categoryRoute from "./admin/category.route";
import userRoute from "./admin/user.route";

import homeRoute from "./admin/home.route";
import authRoute from "./auth/auth.route";
import { orderRoute, orderDataRoute } from "./admin/order.route";
import { promotionDataRoute, promotionRoute } from "./admin/promotion.route";

///client
import { ClientHomeRouter } from "./client/home.route";
import { productAPI } from "./client/product.route";
import cartRouteAPI from "./client/cart.route";
import chatRouteAPI from "./client/chat.route";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
import feedbackRoute from "./client/feedback.route";
import statisticsRouter from "./admin/statistics.route";
import { paymentAPI } from "./client/payment.route";
import favoriteRouteAPI from "./client/favorite.route";

const router = express.Router();
const webRouter = (app: Express) => {

    ////admin
    app.use("/admin", productRoute);
    app.use("/api/admin", productRouteAPI);
    app.use("/admin", categoryRoute);
    app.use("/admin", userRoute);

    app.use("/admin", homeRoute);
    app.use("/admin", orderRoute);
    app.use("/admin", orderDataRoute);
    app.use("/admin", promotionDataRoute);
    app.use("/admin", promotionRoute);
    app.use("/admin", statisticsRouter);
    /////client
    app.use("/", homeRoute);
    app.use("/", feedbackRoute);
    app.use("/", ClientHomeRouter);
    app.use("/api", productAPI);
    app.use("/api", cartRouteAPI);
    app.use("/api", favoriteRouteAPI);
    app.use("/api/payment", paymentAPI);
    app.use("/api/chat", chatRouteAPI);
    app.use("/products", categoryRoute);

    app.use("/auth", authRoute);

    // Middleware 404 - phải để sau cùng
    app.use((req: Request, res: Response) => {
        // Nếu là API request → trả JSON
        if (req.originalUrl.startsWith("/api")) {
            return res.status(404).json({ message: "Not Found" });
        }

        // Nếu là request web → render trang 404
        return res
            .status(404)
            .render("auth/404_page.ejs", { url: req.originalUrl });
    });
};

export default webRouter;
