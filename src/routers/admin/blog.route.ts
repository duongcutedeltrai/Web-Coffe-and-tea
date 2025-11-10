import express from "express";
import BlogController from "../../controller/admin/blog.controller";
import { fileUploadBlogMiddleware } from "../../middleware/multer";

const blogRoute = express.Router();
const blogDataRoute = express.Router();

blogRoute.get("/blogs", BlogController.getBlogPage);
blogRoute.get("/blogs/create", BlogController.getBlogPage);
blogRoute.get("/blogs/:id", BlogController.getBlogPage);

blogDataRoute.post(
  "/data/blogs/create",
  fileUploadBlogMiddleware("thumbnail"),
  BlogController.createBlog
);
blogDataRoute.get("/data/blogs", BlogController.getAllBlogs);
blogDataRoute.get("/data/blogs/:id", BlogController.getBlogByID);
blogDataRoute.put(
  "/data/blogs/update",
  fileUploadBlogMiddleware("thumbnail"),
  BlogController.updateBlog
);
blogDataRoute.delete("/data/blogs/:id", BlogController.deleteBlog);

export { blogRoute, blogDataRoute };
