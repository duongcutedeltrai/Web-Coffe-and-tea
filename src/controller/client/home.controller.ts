import { Request, Response } from "express";

import CategoryService from "../../services/categories.service";
import UserService from "../../services/user.service";
import { product } from "src/routers/client/product.route";
import productsService from "../../services/products.service";
import feedbackService from "../../services/feedback.service";
class ClientHomeController {
    getHomeClientPage = async (req: Request, res: Response) => {
        const user = await UserService.getDetailCustomerById(
            +(req.user as any)?.id || 0
        );

        return res.render("client/home/home.ejs", {
            user: user,
        });
    };

    getCartClientPage = async (req: Request, res: Response) => {
        return res.render("client/cart/cart.ejs", { user: req.user });
    };
    getChatClientPage = async (req: Request, res: Response) => {
        return res.render("client/chat/chat.ejs", { user: req.user });
    };
    getMenuClientPage = async (req: Request, res: Response) => {
        return res.render("client/menu/menu.ejs", { user: req.user });
    };
    getProductDetailPage = async (req: Request, res: Response) => {
        const product = await productsService.getDetailProductsById(
            +req.params.id
        );
        let ratingCounts = [0, 0, 0, 0, 0];
        const feedbacks = await feedbackService.getFeedbackByIdProduct(
            +req.params.id
        );
        feedbacks.forEach((fb) => {
            if (fb.rating >= 1 && fb.rating <= 5) {
                ratingCounts[fb.rating - 1]++;
            }
        });
        const total = feedbacks.length;
        const ratingData = ratingCounts.map((count, i) => ({
            stars: i + 1,
            count,
            percent: total ? (count / total) * 100 : 0,
        }));
        console.log(ratingData);
        return res.render("client/product/product-detail.ejs", {
            user: req.user,
            product,
            feedbacks,
            ratingData,
            total,
        });
    };
    getCheckoutPage = async (req: Request, res: Response) => {
        const user = await UserService.getDetailCustomerById(
            +(req.user as any)?.id || 0
        );
        return res.render("client/cart/checkout.ejs", { user });
    };
}

export default new ClientHomeController();
