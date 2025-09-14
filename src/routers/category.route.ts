import express from "express";
import AdminCategoryController from "../controller/admin/category.controller";
import multer from "multer";

const upload = multer();
const categoryRoute = express.Router();

categoryRoute.get("/categories", AdminCategoryController.getCategoriesPage);
//create
categoryRoute.get(
  "/categories/create",
  AdminCategoryController.getCreateCategoriesPage
);
categoryRoute.post(
  "/categories/create",
  multer().none(),
  AdminCategoryController.createNewCategory
);
//update
categoryRoute.get(
  "/categories/update/:id",
  AdminCategoryController.getUpdateCategoriesPage
);
categoryRoute.post(
  "/categories/update/:id",
  AdminCategoryController.updateCategory
);

categoryRoute.post(
  "/categories/delete/:id",
  AdminCategoryController.deleteCategory
);

export default categoryRoute;
