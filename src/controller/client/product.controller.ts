import categoriesService from "../../services/categories.service";
import ProductService from "../../services/products.service";
import { Request, Response } from "express";
class ProductClientController {
    getProductsfilterAPI = async (req: Request, res: Response) => {
        try {
            const {
                category,
                sort,
                minPrice,
                maxPrice,
                keyword,
                page = 1,
            } = req.query;
            const result = await ProductService.getFilteredProducts({
                category,
                sort,
                minPrice,
                maxPrice,
                keyword,
                page: Number(page) || 1,
            });
            return res.json(result);
        } catch (error) {
            console.error("❌ Lỗi khi lấy sản phẩm:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };
  
    getCategoriesAPI = async (req: Request, res: Response) => {
        try {
            res.json({
                categories: await categoriesService.getAllCategories(),
            });
        } catch (error) {
            console.error("Error in getCategoriesAPI:", error);
        }
    };
}
export default new ProductClientController();
