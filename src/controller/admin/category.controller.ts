import { Request, Response } from "express";
import CategoryService from "../../services/categories.service";

class AdminCategoryController {
  async getCategoriesPage(req: Request, res: Response) {
    const allCategories = await CategoryService.getAllCategories();
    return res.render("admin/categories/categories.ejs", {
      categories: allCategories,
    });
  }
  async getCategoryData(req: Request, res: Response) {
    const allCategories = await CategoryService.getAllCategories();
    return res.json(allCategories);
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
      await CategoryService.createNewCategory(data);
      return res.redirect("/admin/categories");
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  async getUpdateCategoriesPage(req: Request, res: Response) {
    const id = req.params.id;
    const category = await CategoryService.getCategoryById(Number(id));
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
      await CategoryService.updateCategory(Number(id), data);
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
      await CategoryService.deleteCategory(Number(id));
      return res.redirect("/admin/categories");
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
export default new AdminCategoryController();
