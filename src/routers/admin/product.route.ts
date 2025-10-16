import express from "express";
import AdminProductController from "../../controller/admin/product.controller";
import { fileUploadProductMiddleware } from "../../middleware/multer";

const productRoute = express.Router();
const productRouteAPI = express.Router();

productRoute.get("/products", (req, res) => {
  res.render("admin/products/products.ejs");
});

productRoute.get(
  "/products/details/:id",
  AdminProductController.getDetailProductPage
);

productRouteAPI.get("/products", AdminProductController.getProductsAPI);
// productRouteAPI.post(
//     "/products",
//     fileUploadProductMiddleware("image"),
//     AdminProductController.createProduct
// );
productRouteAPI.get(
  "/categories/:id/products",
  AdminProductController.getProductByCategoriesId
);

productRouteAPI.get(
  "/products/data",
  AdminProductController.getAllDataProducts
);

export { productRoute, productRouteAPI };
