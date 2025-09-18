import { Request, Response } from "express";
import AdminProductService from "../../services/admin/products.service";
import AdminCategoryService from "../../services/admin/categories.service";

class AdminProductController {
    getProductsAPI = async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const products = await AdminProductService.getProducts(currentPage);
            const { totalPages, totalItems } =
                await AdminProductService.countTotalProductPages("all");
            const categories = await AdminCategoryService.getAllCategories();
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

    getProductByCategoriesId = async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            const id_category = req.params.id;
            let currentPage = page ? +page : 1;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            const products = await AdminProductService.getProductsByCategories(
                currentPage,
                +id_category
            );
            const { totalPages, totalItems } =
                await AdminProductService.countTotalProductPages(
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
    // createProduct = async () => {
    //     const { name, desc, sizeM, sizeL, sizeXL };
    // };
    getDetailProductPage = async (req: Request, res: Response) => {
        return res.render("admin/products/detail_product.ejs");
    };
}

export default new AdminProductController();
