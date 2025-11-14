import { prisma } from "../config/client";


class DashboardService {

    getCustomerCount = async () => {
        const customers = await prisma.users.count({
            where: {
                role_id: 3
            }
        });
        return customers;
    }

    getStaff = async () => {
        const staffs = await prisma.staff_detail.findMany({

        });

        return staffs
    }

    getStaffDetail = async () => {
        const staffDetail = await prisma.staff_detail.findMany({
        });

        return staffDetail

    }

    getTrendingProducts = async () => {
        const bestSellers = await prisma.order_details.groupBy({
            by: ["product_id"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 6,
        });

        const bestSellerIds = bestSellers.map((p) => p.product_id);

        const products = await prisma.products.findMany({
            where: { product_id: { in: bestSellerIds } },
            select: {
                product_id: true,
                name: true,
                images: true, // in your schema images is a string (filename)
                categories: { select: { name: true } },
            },
        });

        const topProducts = bestSellers.map((b) => {
            const prod = products.find((p) => p.product_id === b.product_id);
            return {
                product_id: b.product_id,
                name: prod?.name || "Không xác định",
                category: prod?.categories?.name || "Khác",
                image: prod?.images || null,
                sold: b._sum.quantity || 0,
            };
        });

        return {
            bestSellerIds,
            bestSellers,
            topProducts,

        }

    }

    getProductFromOrderDetails = async () => {
        const product = await prisma.orders.findMany({
            include: {
                order_details: {
                    include: {
                        products: true,
                    }
                },
            }
        });
        return product;
    }

}

export default new DashboardService();