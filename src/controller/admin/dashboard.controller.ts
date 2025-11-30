import { Request, Response } from "express";
import orderService from "../../services/order.service";
import AdminUserService from "../../services/user.service";
import dashboardService from "../../services/dashboard.service";

class AdminDashboardController {
    getDashboardAdminPage = async (req: Request, res: Response) => {
        const totalAmount = await orderService.getAllOrders();
        const customers = await dashboardService.getCustomerCount();
        const staffs = await dashboardService.getStaff();
        const staffDetails = await dashboardService.getStaffDetail();
        const products = await dashboardService.getProductFromOrderDetails();
        const blogs = await dashboardService.getAllBlogs();


        const blog = blogs[2];
        // Lọc đơn hàng hôm nay
        const today = new Date();
        const todayOrders = totalAmount.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return (
                orderDate.getDate() === today.getDate() &&
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getFullYear() === today.getFullYear()
            );
        });

        const trending = await dashboardService.getTrendingProducts();

        return res.render("admin/dashboard/dashboard.ejs", {
            totalAmount: totalAmount,
            customers: customers,
            staffs: staffs,
            staffDetails: staffDetails,
            todayOrders: todayOrders.length,
            trending: trending,
            products: products,
            blog: blog
        });
    };
}

export default new AdminDashboardController();
