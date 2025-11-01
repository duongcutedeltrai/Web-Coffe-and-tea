import express from "express";
import AdminProductController from "../../controller/admin/product.controller";
import ProductClientController from "../../controller/client/product.controller";

const product = express.Router();

const productAPI = express.Router();
productAPI.get(
    "/product/sellers",
    ProductClientController.getProductsSellerAPI
);
productAPI.get("/products", ProductClientController.getProductsfilterAPI);
productAPI.get("/categories", ProductClientController.getCategoriesAPI);

export { product, productAPI };
