import { Request, Response } from "express";
import ProductService from "../../services/products.service";
import CategoryService from "../../services/categories.service";
import { file } from "zod";
import { parsePrice } from "src/utils/parse";
import { ProductSchema, TProductSchema } from "../../validation/product.schema";

class AdminProductController {
    getProductsAPI = async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const products = await ProductService.getProducts(currentPage);
            const { totalPages, totalItems } =
                await ProductService.countTotalProductPages("all");
            const categories = await CategoryService.getAllCategories();
            res.json({
                products,
                currentPage: page,
                totalPages,
                totalItems,
                categories,
            });
        } catch (error) {
            console.error("Error in getProductsAPI:", error);
            res.status(500).json({
                message: "Có lỗi xảy ra khi lấy sản phẩm",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    getAllDataProducts = async (req: Request, res: Response) => {
        try {
            const products = await ProductService.getAllDataProducts();
            return res.json(products);
        } catch (error) {
            console.error("Error in getAllDataProducts:", error);
            throw error;
        }
    };
    getProductByCategoriesId = async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            const id_category = req.params.id;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const products = await ProductService.getProductsByCategories(
                currentPage,
                +id_category
            );
            const { totalPages, totalItems } =
                await ProductService.countTotalProductPages(
                    "categories",
                    +id_category
                );
            res.json({ products, currentPage: page, totalPages, totalItems });
        } catch (error) {
            console.error("Error in getProductByCategoriesId:", error);
            res.status(500).json({
                message: "Có lỗi xảy ra khi lấy sản phẩm thuoc danh muc",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    createProduct = async (req: Request, res: Response) => {
        try {
            const images = req?.file?.filename;
            console.log(req.body);
            const validate = ProductSchema.safeParse(req.body);
            if (!validate.success) {
                const errorZod = validate.error.issues;
                const errors = errorZod?.map((item) => ({
                    field: item.path[0], // tên field trong schema
                    message: item.message,
                }));
                return res.status(200).json({ success: false, errors });
            }

            const {
                name,
                desc,
                sizeM,
                sizeL,
                sizeXL,
                defaultPrice,
                status,
                category,
                quantity,
            } = req.body as TProductSchema;

            const productData: any = {
                name,
                desc,
                status,
                category,
                quantity: quantity,
                images,
            };
            // Nếu có giá theo size
            const hasSizePrice = sizeM > 0 || sizeL > 0 || sizeXL > 0;
            if (hasSizePrice) {
                productData.prices = { M: sizeM, L: sizeL, XL: sizeXL };
            } else if (defaultPrice > 0) {
                // Nếu có giá cố định
                productData.defaultPrice = defaultPrice;
            }
            const product = await ProductService.createProduct(productData);
            return res.status(201).json({
                success: true,
                message: "Tạo sản phẩm thành công",
                data: product,
            });
        } catch (error) {
            console.error("Error in createProduct:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi tạo sản phẩm",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    getDetailProductPage = async (req: Request, res: Response) => {
        const id = req.params.id;
        const product = await ProductService.getDetailProductsById(+id);
        const categories = await CategoryService.getAllCategories();
        return res.render("admin/products/detail_product.ejs", {
            product,
            categories,
        });
    };

    updateProduct = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const images = req?.file?.filename || req.body.old_images;
            console.log(req.body);
            const validate = ProductSchema.safeParse(req.body);
            if (!validate.success) {
                const errorZod = validate.error.issues;
                const errors = errorZod?.map((item) => ({
                    field: item.path[0], // tên field trong schema
                    message: item.message,
                }));
                return res.status(200).json({ success: false, errors });
            }

            const {
                name,
                desc,
                sizeM,
                sizeL,
                sizeXL,
                defaultPrice,
                status,
                category,
                quantity,
            } = req.body as TProductSchema;

            const productData: any = {
                id: id,
                name,
                desc,
                status,
                category,
                quantity: quantity,
                images,
            };
            // Nếu có giá theo size
            const hasSizePrice = sizeM > 0 || sizeL > 0 || sizeXL > 0;
            if (hasSizePrice) {
                productData.prices = { M: sizeM, L: sizeL, XL: sizeXL };
            } else if (defaultPrice > 0) {
                // Nếu có giá cố định
                productData.defaultPrice = defaultPrice;
            }
            const product = await ProductService.updateProduct(productData);
            return res.status(201).json({
                success: true,
                message: "Chỉnh sửa sản phẩm thành công",
                data: product,
            });
        } catch (error) {
            console.error("Error in createProduct:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi chỉnh sửa sản phẩm",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    searchProductAPI = async (req: Request, res: Response) => {
        try {
            const { q, page } = req.query;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const { products, totalItems, totalPages } =
                await ProductService.getProductsSearch(q, currentPage);
            res.json({
                success: true,
                products,
                currentPage: page,
                totalPages,
                totalItems,
            });
        } catch (error) {
            console.error("Error in getProductsAPI:", error);
            res.status(500).json({
                message: "Có lỗi xảy ra khi lấy sản phẩm tim kiem",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    searchProductCategoryAPI = async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;
            const { q, page } = req.query;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const { products, totalItems, totalPages } =
                await ProductService.getProductsSearchCategory(
                    q,
                    currentPage,
                    +categoryId
                );
            res.json({
                success: true,
                products,
                currentPage: page,
                totalPages,
                totalItems,
            });
        } catch (error) {
            console.error("Error in getProductsAPI:", error);
            res.status(500).json({
                message:
                    "Có lỗi xảy ra khi lấy sản phẩm tim kiem trong danh muc",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
    deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            await ProductService.deleteProduct(+id);
            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error("Error in delete Product:", error);
            res.status(500).json({
                message: "Có lỗi xảy ra khi xóa sản phẩm",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
}

export default new AdminProductController();
