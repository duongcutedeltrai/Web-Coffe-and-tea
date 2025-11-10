import { Request, Response } from "express";
import BlogService from "../../services/admin/blog.service";
import { uploadIMG } from "../../services/uploadIMG.service";

class BlogController {
  async getBlogPage(req: Request, res: Response) {
    return res.render("admin/blogs/blogs-management.ejs");
  }

  async createBlog(req: Request, res: Response) {
    try {
      console.log(req.body);
      console.log(req.file);

      let thumbnailUrl = null;

      // Nếu có file ảnh được upload
      if (req.file) {
        const filePath = req.file.path;
        thumbnailUrl = await uploadIMG(filePath);

        if (!thumbnailUrl) {
          return res
            .status(400)
            .json({ error: "Lỗi upload ảnh lên Cloudinary" });
        }
      }

      // Cập nhật data với URL Cloudinary
      const blogData = {
        ...req.body,
        thumbnail: thumbnailUrl,
      };

      const blog = await BlogService.createBlog(blogData);
      return res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllBlogs(req: Request, res: Response) {
    try {
      const blogs = await BlogService.getAllBlogs();
      return res.json(blogs);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
  async getBlogByID(req: Request, res: Response) {
    try {
      const blogID = req.params.id;
      const blog = await BlogService.getBlogByID(blogID);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      return res.json(blog);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
  async updateBlog(req: Request, res: Response) {
    try {
      const blogData = req.body;
      if (req.file) {
        blogData.thumbnail = `/images/blogs/${req.file.filename}`;
      }
      const updatedBlog = await BlogService.updateBlog({
        blog_id: req.body.blog_id,
        ...blogData,
      });
      return res.json(updatedBlog);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const blogID = req.params.id;
      await BlogService.deleteBlog(blogID);
      return res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
export default new BlogController();
