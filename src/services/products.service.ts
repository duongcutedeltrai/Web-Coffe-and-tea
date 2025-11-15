import {
    TOTAL_ITEMS_PER_PAGE,
    TOTAL_ITEMS_PER_PAGE_CLIENT,
} from "../config/constant";
import { prisma } from "../config/client";
import { Request, Response } from "express";
import { number } from "zod";

class ProductService {
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
    getProductsSearch = async (q, currentPage: number) => {
        try {
            const pageSize = TOTAL_ITEMS_PER_PAGE;
            const [products, totalItems] = await Promise.all([
                prisma.products.findMany({
                    where: {
                        name: {
                            contains: q || "",
                        },
                    },
                    include: {
                        price_product: true,
                        categories: true,
                    },
                    skip: (currentPage - 1) * pageSize,
                    take: pageSize,
                }),
                prisma.products.count({
                    where: {
                        name: {
                            contains: q || "",
                        },
                    },
                }),
            ]);
            const totalPages = Math.ceil(totalItems / pageSize);
            return {
                products,
                totalItems,
                totalPages,
            };
        } catch (error) {
            console.error("Error search products:", error);
            throw error;
        }
    };
    getProductsSearchCategory = async (
        q,
        currentPage: number,
        categoryId: number
    ) => {
        try {
            const pageSize = TOTAL_ITEMS_PER_PAGE;
            const [products, totalItems] = await Promise.all([
                prisma.products.findMany({
                    where: {
                        category_id: categoryId,
                        name: {
                            contains: q || "",
                        },
                    },
                    include: {
                        price_product: true,
                        categories: true,
                    },
                    skip: (currentPage - 1) * pageSize,
                    take: pageSize,
                }),
                prisma.products.count({
                    where: {
                        category_id: categoryId,
                        name: {
                            contains: q || "",
                        },
                    },
                }),
            ]);
            const totalPages = Math.ceil(totalItems / pageSize);
            return {
                products,
                totalItems,
                totalPages,
            };
        } catch (error) {
            console.error("Error search products category:", error);
            throw error;
        }
    };
    deleteProduct = async (id: number) => {
        try {
            await prisma.products.delete({
                where: {
                    product_id: id,
                },
            });
        } catch (error) {
            console.error("Error delete products :", error);
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

    createProduct = async (data) => {
        try {
            // Tạo mảng giá sản phẩm
            const priceEntries: {
                size: "M" | "L" | "XL" | "DEFAULT";
                price: number;
            }[] = [];

            if (data.defaultPrice && +data.defaultPrice > 0) {
                // Nếu có giá cố định
                priceEntries.push({
                    size: "DEFAULT",
                    price: +data.defaultPrice,
                });
            } else if (data.prices) {
                // Nếu có giá theo size, chỉ thêm những size > 0
                ["M", "L", "XL"].forEach((s) => {
                    const val = +data.prices[s];
                    if (val > 0) {
                        priceEntries.push({
                            size: s as "M" | "L" | "XL",
                            price: val,
                        });
                    }
                });
            }
            const product = await prisma.products.create({
                data: {
                    name: data.name,
                    description: data.desc,
                    status: data.status,
                    category_id: +data.category,
                    quantity: +data.quantity,
                    images: data.images,
                    // nested create prices
                    price_product: {
                        create: priceEntries,
                    },
                },
                include: {
                    price_product: true, // trả về luôn giá theo size
                },
            });
        } catch (error) {
            console.error("❌ Lỗi khi tạo product:", error);
            throw error;
        }
    };
    updateProduct = async (data) => {
        try {
            // Tạo mảng giá sản phẩm
            const priceEntries: {
                size: "M" | "L" | "XL" | "DEFAULT";
                price: number;
            }[] = [];

            if (data.defaultPrice && +data.defaultPrice > 0) {
                // Nếu có giá cố định
                priceEntries.push({
                    size: "DEFAULT",
                    price: +data.defaultPrice,
                });
            } else if (data.prices) {
                // Nếu có giá theo size, chỉ thêm những size > 0
                ["M", "L", "XL"].forEach((s) => {
                    const val = +data.prices[s];
                    if (val > 0) {
                        priceEntries.push({
                            size: s as "M" | "L" | "XL",
                            price: val,
                        });
                    }
                });
            }
            const product = await prisma.products.update({
                where: {
                    product_id: +data.id,
                },
                data: {
                    name: data.name,
                    description: data.desc,
                    status: data.status,
                    category_id: +data.category,
                    quantity: +data.quantity,
                    images: data.images,
                    // nested create prices
                    price_product: {
                        deleteMany: {},
                        create: priceEntries,
                    },
                },
                include: {
                    price_product: true, // trả về luôn giá theo size
                },
            });
        } catch (error) {
            console.error("❌ Lỗi khi chỉnh sửa product:", error);
            throw error;
        }
    };
    getDetailProductsById = async (id: number) => {
        try {
            const product = await prisma.products.findFirst({
                where: {
                    product_id: id,
                },
                include: {
                    price_product: true,
                    categories: true,
                },
            });
            return product;
        } catch (error) {
            console.error("Error fetching products by id:", error);
            throw error;
        }
    };
    getSizeProductId = async (id: number) => {
        try {
            const sizeProduct = await prisma.price_product.findMany({
                where: { product_id: id },
            });
            return sizeProduct;
        } catch (error) {
            console.error("Error fetching size product by id:", error);
            throw error;
        }
    };
    getFilteredProducts = async ({
        category,
        sort,
        minPrice,
        maxPrice,
        keyword,
        page = 1,
        perPage = 8,
    }) => {
        const min = parseInt(String(minPrice)) || 0;
        const max = parseInt(String(maxPrice)) || 999999999;
        const pageNum = Number(page) || 1;
        const skip = (pageNum - 1) * perPage;

        // Build filters (note: price range filter is applied via price_product.some)
        const filters: any = {
            AND: [
                category ? { categories: { name: { equals: category } } } : {},
                keyword ? { name: { contains: keyword } } : {},
                {
                    price_product: {
                        some: {
                            price: { gte: min, lte: max },
                        },
                    },
                },
            ],
        };

        // 1) Lấy danh sách product_id phù hợp (dùng để groupBy / count)
        const matched = await prisma.products.findMany({
            where: filters,
            select: { product_id: true },
        });
        const matchedIds = matched.map((m: any) => m.product_id);
        const totalProducts = matchedIds.length;
        const totalPages = Math.ceil(totalProducts / perPage);

        if (totalProducts === 0) {
            return {
                products: [],
                totalPages: 0,
                currentPage: pageNum,
                totalProducts: 0,
            };
        }

        // 2) Nếu sort theo giá -> dùng groupBy trên price_product để lấy product_id theo MIN price
        if (sort === "price-asc" || sort === "price-desc") {
            const grouped = await prisma.price_product.groupBy({
                by: ["product_id"],
                where: {
                    product_id: { in: matchedIds },
                    price: { gte: min, lte: max },
                },
                _min: { price: true },
                orderBy: {
                    _min: { price: sort === "price-desc" ? "desc" : "asc" },
                },
                skip,
                take: perPage,
            });

            const orderedIds = grouped.map((g: any) => g.product_id);

            //  Lấy products theo orderedIds, include các relation cần
            let productsFilter = await prisma.products.findMany({
                where: { product_id: { in: orderedIds } },
                include: {
                    price_product: {
                        where: { price: { gte: min, lte: max } },
                        select: { size: true, price: true },
                    },
                    categories: { select: { name: true } },
                },
            });

            // Sắp theo thứ tự orderedIds
            productsFilter.sort(
                (a: any, b: any) =>
                    orderedIds.indexOf(a.product_id) -
                    orderedIds.indexOf(b.product_id)
            );

            return {
                productsFilter,
                totalPages,
                currentPage: pageNum,
                totalProducts,
            };
        }

        //  Với các loại sort khác (createdAt, bestseller), dùng findMany bình thường
        const sortOptions: any = {
            newest: { createdAt: "desc" },
            oldest: { createdAt: "asc" },
            bestseller: { sold: "desc" },
        };
        const orderBy = sortOptions[sort] || { createdAt: "desc" };

        const productsFilter = await prisma.products.findMany({
            where: filters,
            orderBy,
            skip,
            take: perPage,
            include: {
                price_product: {
                    where: { price: { gte: min, lte: max } },
                    select: { size: true, price: true },
                },
                categories: { select: { name: true } },
            },
        });

        return {
            productsFilter,
            totalPages,
            currentPage: pageNum,
            totalProducts,
        };
    };
    async getAllDataProducts() {
        try {
            const products = await prisma.products.findMany({
                include: {
                    price_product: true,
                },
            });
            return products;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw error;
        }
    }
}

export default new ProductService();
