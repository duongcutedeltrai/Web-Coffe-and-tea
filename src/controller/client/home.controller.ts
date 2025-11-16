import { Request, Response } from "express";

import CategoryService from "../../services/categories.service";
import UserService from "../../services/user.service";
import { product } from "src/routers/client/product.route";
import productsService from "../../services/products.service";
import feedbackService from "../../services/feedback.service";
import blogService from "../../services/blog.service";
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
    getFavoritesClientPage = async (req: Request, res: Response) => {
        const user = await UserService.getDetailCustomerById(
            +(req.user as any)?.id || 0
        );
        return res.render("client/favorite/favorites.ejs", { user });
    };
    getBlogDetailPage = async (req: Request, res: Response) => {
    const user = await UserService.getDetailCustomerById(
        +(req.user as any)?.id || 0
    );

    const blogID = req.params.id;
    const blog = await blogService.getBlogByID(blogID);
 if (blog) {
     await blogService.incrementView(blogID);
    }
    // Lấy tất cả blog PUBLISHED theo thứ tự
    const allBlogs = await blogService.getPublishedBlogs();

    // Tìm index của blog hiện tại
    const currentIndex = allBlogs.findIndex(b => b.blog_id === blogID);

    // Blog trước và blog tiếp theo
    const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
    const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

    return res.render("client/blog/blog.ejs", {
        user,
        blog,
        prevBlog,
        nextBlog,
    });
};

getBlogPage = async (req: Request, res: Response) => {
    const user = await UserService.getDetailCustomerById(
        +(req.user as any)?.id || 0
    );

    // Lấy tất cả blog đã xuất bản, có thể sắp xếp theo ngày tạo giảm dần
    const blogs = await blogService.getPublishedBlogs();

    // Render EJS với user và blogs
    return res.render("client/blog/listBlog.ejs", { user, blogs });
};
getVoucherPage= async (req: Request, res: Response) => {
    const user = await UserService.getDetailCustomerById(
        +(req.user as any)?.id || 0
    );
    // Render EJS với user và blogs
    return res.render("client/voucher/voucher.ejs", { user });
};
getSuccessPage=async (req:Request,res: Response)=>{
    const user = await UserService.getDetailCustomerById(
        +(req.user as any)?.id || 0
    );
    // Render EJS với user và blogs
    return res.render("client/success/success.ejs", { user });
}
getOrderPage=async (req:Request,res: Response)=>{
    const user = await UserService.getDetailCustomerById(
        +(req.user as any)?.id || 0
    );
    // Render EJS với user và blogs
    return res.render("client/order/order.ejs", { user });
}
}

export default new ClientHomeController();
