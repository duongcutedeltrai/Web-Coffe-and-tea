import express from "express";
import AdminProductController from "../../controller/admin/product.controller";
import { fileUploadProductMiddleware } from "../../middleware/multer";
import { authMiddleware,   roleMiddleware,
    authAndRoleMiddleware,
    adminStaffGuard, } from "../../middleware/auth.middleware";

const productRoute = express.Router();
const productRouteAPI = express.Router();

productRoute.get("/products", authAndRoleMiddleware,
    adminStaffGuard,(req, res) => {
    res.render("admin/products/products.ejs");
});

productRoute.get("/products/:id", authAndRoleMiddleware,
    adminStaffGuard,AdminProductController.getDetailProductPage);
productRoute.put(
    "/products/:id",
    fileUploadProductMiddleware("image"),
    AdminProductController.updateProduct
);
productRouteAPI.delete("/products/:id", AdminProductController.deleteProduct);
productRouteAPI.post(
    "/products",
    fileUploadProductMiddleware("image"),
    AdminProductController.createProduct
);
productRouteAPI.get("/products", AdminProductController.getProductsAPI);
productRouteAPI.get(
    "/categories/:categoryId/products/search",
    AdminProductController.searchProductCategoryAPI
);
productRouteAPI.get(
    "/products/search",
    AdminProductController.searchProductAPI
);
productRouteAPI.get(
    "/categories/:id/products",
    AdminProductController.getProductByCategoriesId
);

productRouteAPI.get(
    "/products/data",
    AdminProductController.getAllDataProducts
);

export { productRoute, productRouteAPI };
