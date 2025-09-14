import { Request, Response } from "express";
import AdminCategoryService from "../../services/admin/categories.service";

class AdminCategoryController {
  async getCategoriesPage(req: Request, res: Response) {
    const allCategories = await AdminCategoryService.getAllCategories();
    return res.render("admin/categories/categories.ejs", {
      categories: allCategories,
    });
  }

  async getCreateCategoriesPage(req: Request, res: Response) {
    return res.render("admin/categories/create_category.ejs");
  }
  async createNewCategory(req: Request, res: Response) {
    try {
      const data = {
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription,
        image: req.file.filename,
      };
      await AdminCategoryService.createNewCategory(data);
      return res.redirect("/admin/categories");
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async getUpdateCategoriesPage(req: Request, res: Response) {
    const id = req.params.id;
    const category = await AdminCategoryService.getCategoryById(Number(id));
    return res.render("admin/categories/update_category.ejs", { category });
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = {
        groupName: req.body.groupName,
        groupDescription: req.body.groupDescription,
        images: req?.file?.filename,
      };
      await AdminCategoryService.updateCategory(Number(id), data);
      return res.redirect("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await AdminCategoryService.deleteCategory(Number(id));
      return res.redirect("/admin/categories");
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
export default new AdminCategoryController();
