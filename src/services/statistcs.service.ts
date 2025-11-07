
import { prisma } from "../config/client";

import {
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfWeek,
    endOfWeek,
    subWeeks,
    startOfYear,
    endOfYear,
    subYears,
} from "date-fns";

class AdminStatisticService {
    getStatisticPage = async (period: string) => {
        let labels: string[] = [];
        let revenues: number[] = [];
        let orders: number[] = [];


        // Xác định số lượng mốc thời gian (6 gần nhất)
        let count = 6;

        if (period === "week") {
            for (let i = count - 1; i >= 0; i--) {

                const start = startOfWeek(subWeeks(new Date(), i), {
                    weekStartsOn: 1,
                });
                const end = endOfWeek(subWeeks(new Date(), i), {
                    weekStartsOn: 1,
                });

                const ordersData = await prisma.orders.findMany({
                    where: { orderDate: { gte: start, lte: end } },
                    select: { final_amount: true, order_id: true },
                });

                const totalRevenue = ordersData.reduce(
                    (sum, o) => sum + Number(o.final_amount),
                    0
                );
                labels.push(
                    `${start.getDate()}/${start.getMonth() + 1
                    } - ${end.getDate()}/${end.getMonth() + 1}`
                );
                revenues.push(totalRevenue);
                orders.push(ordersData.length);
            }
        } else if (period === "year") {
            for (let i = count - 1; i >= 0; i--) {
                const start = startOfYear(subYears(new Date(), i));
                const end = endOfYear(subYears(new Date(), i));

                const ordersData = await prisma.orders.findMany({
                    where: { orderDate: { gte: start, lte: end } },

                    select: { final_amount: true, order_id: true },
                });

                const totalRevenue = ordersData.reduce(
                    (sum, o) => sum + Number(o.final_amount),
                    0
                );
                labels.push(`${start.getFullYear()}`);
                revenues.push(totalRevenue);
                orders.push(ordersData.length);
            }

        } else {
            // Mặc định là "month"
            for (let i = count - 1; i >= 0; i--) {
                const start = startOfMonth(subMonths(new Date(), i));
                const end = endOfMonth(subMonths(new Date(), i));

                const ordersData = await prisma.orders.findMany({
                    where: { orderDate: { gte: start, lte: end } },

                    select: { final_amount: true, order_id: true },
                });

                const totalRevenue = ordersData.reduce(
                    (sum, o) => sum + Number(o.final_amount),
                    0
                );
                labels.push(`${start.getMonth() + 1}/${start.getFullYear()}`);
                revenues.push(totalRevenue);
                orders.push(ordersData.length);
            }
        }

        // ----------------------------
        // 2) Top 5 sản phẩm bán chạy
        // ----------------------------
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

        // ----------------------------
        // 3) Trending products (growth month-to-month)
        // Approach: lấy order_id mỗi tháng => groupBy order_details bằng order_id in [...]
        // ----------------------------
        const now = new Date();
        const startThisMonth = startOfMonth(now);
        const endThisMonth = endOfMonth(now);
        const startLastMonth = startOfMonth(subMonths(now, 1));
        const endLastMonth = endOfMonth(subMonths(now, 1));

        // helper: lấy order_ids trong khoảng
        const getOrderIdsInRange = async (start: Date, end: Date) => {
            const ords = await prisma.orders.findMany({
                where: { orderDate: { gte: start, lte: end } },
                select: { order_id: true },
            });
            return ords.map((o) => o.order_id);
        };

        // Lấy order ids cho tháng hiện tại & tháng trước

        let thisMonthOrderIds = await getOrderIdsInRange(
            startThisMonth,
            endThisMonth
        );
        let lastMonthOrderIds = await getOrderIdsInRange(
            startLastMonth,
            endLastMonth
        );

        // fallback: nếu tháng hiện tại không có order -> so sánh tháng trước vs tháng trước nữa
        if (thisMonthOrderIds.length === 0) {
            const startPrevPrev = startOfMonth(subMonths(now, 2));
            const endPrevPrev = endOfMonth(subMonths(now, 2));
            // So sánh lastMonth vs prevPrev

            thisMonthOrderIds = await getOrderIdsInRange(
                startLastMonth,
                endLastMonth
            );
            lastMonthOrderIds = await getOrderIdsInRange(
                startPrevPrev,
                endPrevPrev
            );
        }

        // groupBy order_details for those order ids
        const thisMonthGroups =
            thisMonthOrderIds.length > 0
                ? await prisma.order_details.groupBy({

                    by: ["product_id"],
                    where: { order_id: { in: thisMonthOrderIds } },
                    _sum: { quantity: true },
                })
                : [];

        const lastMonthGroups =
            lastMonthOrderIds.length > 0
                ? await prisma.order_details.groupBy({

                    by: ["product_id"],
                    where: { order_id: { in: lastMonthOrderIds } },
                    _sum: { quantity: true },
                })
                : [];

        // Build map for fast lookup
        const lastMap = new Map<number, number>();
        lastMonthGroups.forEach((g: any) => {
            lastMap.set(g.product_id, g._sum?.quantity || 0);
        });

        // Compute growth array

        const trendingRaw: {
            product_id: number;
            sold: number;
            growth: number;
        }[] = [];
        thisMonthGroups.forEach((g: any) => {
            const sold = g._sum?.quantity || 0;
            const prev = lastMap.get(g.product_id) || 0;
            const growth = prev ? ((sold - prev) / prev) * 100 : 100;
            trendingRaw.push({ product_id: g.product_id, sold, growth });
        });

        // sort & top 5

        const topTrending = trendingRaw
            .sort((a, b) => b.growth - a.growth)
            .slice(0, 5);
        const trendingIds = topTrending.map((t) => t.product_id);

        // fetch product info
        const trendingInfo = trendingIds.length
            ? await prisma.products.findMany({

                where: { product_id: { in: trendingIds } },
                select: {
                    product_id: true,
                    name: true,
                    images: true,
                    categories: { select: { name: true } },
                },
            })
            : [];

        const trendingProducts = topTrending.map((t) => {
            const prod = trendingInfo.find(
                (p) => p.product_id === t.product_id
            );
            return {
                product_id: t.product_id,
                name: prod?.name || "Không xác định",
                category: prod?.categories?.name || "Khác",
                image: prod?.images || null,
                sold: t.sold,
                growth: Number(t.growth.toFixed(2)),
            };
        });

        // ----------------------------
        // 4) Favorite products (avg rating) with fallback
        // ----------------------------
        const favoriteProductsRaw = await prisma.feedback.groupBy({
            by: ["product_id"],
            _avg: { rating: true },
        });

        const validFavorites = favoriteProductsRaw
            .filter((f) => f._avg && f._avg.rating != null)
            .sort((a, b) => (b._avg.rating || 0) - (a._avg.rating || 0))
            .slice(0, 5);

        let favoriteProducts = [];

        if (validFavorites.length > 0) {
            const favoriteIds = validFavorites.map((f) => f.product_id);
            const favoriteInfo = await prisma.products.findMany({
                where: { product_id: { in: favoriteIds } },
                select: {
                    product_id: true,
                    name: true,
                    images: true,
                    categories: { select: { name: true } },
                },
            });

            favoriteProducts = validFavorites.map((f) => {

                const prod = favoriteInfo.find(
                    (p) => p.product_id === f.product_id
                );
                return {
                    product_id: f.product_id,
                    name: prod?.name || "Không xác định",
                    category: prod?.categories?.name || "Khác",
                    image: prod?.images || null,
                    rating: Number(f._avg.rating?.toFixed(1) || 0),
                };
            });
        } else {
            // fallback: nếu không có feedback, dùng topProducts làm favorites
            favoriteProducts = topProducts.map((p) => ({
                product_id: p.product_id,
                name: p.name,
                category: p.category,
                image: p.image,
                rating: null,
            }));
        }


        const totalOrders = await prisma.orders.count();

        // Return payload
        return {
            labels,
            revenues,
            orders,
            topProducts,
            trendingProducts,
            favoriteProducts,

            totalOrders,
        };
    };
}

export default new AdminStatisticService();
