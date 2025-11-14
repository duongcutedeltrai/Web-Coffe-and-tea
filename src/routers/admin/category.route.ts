import express from "express";
import AdminCategoryController from "../../controller/admin/category.controller";
import multer from "multer";
import { fileUploadCategoriesMiddleware } from "../../middleware/multer";

const upload = multer();
const categoryRoute = express.Router();

categoryRoute.get("/categories", AdminCategoryController.getCategoriesPage);
categoryRoute.get("/categories/data", AdminCategoryController.getCategoryData);
//create
categoryRoute.get(
  "/categories/create",
  AdminCategoryController.getCreateCategoriesPage
);
categoryRoute.post(
  "/categories/create",
  fileUploadCategoriesMiddleware("groupImage"),
  AdminCategoryController.createNewCategory
);
//update
categoryRoute.get(
  "/categories/update/:id",
  AdminCategoryController.getUpdateCategoriesPage
);
categoryRoute.post(
  "/categories/update/:id",
  fileUploadCategoriesMiddleware("groupImage"),
  AdminCategoryController.updateCategory
);

categoryRoute.post(
  "/categories/delete/:id",
  AdminCategoryController.deleteCategory
);

export default categoryRoute;
