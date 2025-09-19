import { TOTAL_ITEMS_PER_PAGE } from "../../config/constant";
import { prisma } from "../../config/client";
import { Request, Response } from "express";

class AdminProductService {
    getProducts = async (page: number) => {
        try {
            const pageSize = TOTAL_ITEMS_PER_PAGE;
            const product = await prisma.products.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    price_product: true,
                },
            });
            return product;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    };
    countTotalProductPages = async (
        typeGet: string,
        idCategory: number = -1
    ) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        let totalItems;
        if (typeGet == "all") {
            totalItems = await prisma.products.count();
        } else if (typeGet == "categories") {
            totalItems = await prisma.products.count({
                where: { category_id: idCategory },
            });
        }

        const totalPages = Math.ceil(totalItems / pageSize);
        return { totalPages, totalItems };
    };
    getProductsByCategories = async (page: number, id_category: number) => {
        try {
            const pageSize = TOTAL_ITEMS_PER_PAGE;
            const product = await prisma.products.findMany({
                where: {
                    category_id: id_category,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    price_product: true,
                },
            });
            return product;
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    };
}

export default new AdminProductService();
