import { prisma } from "../config/client";
import slugify from "slugify";

class BlogService {
  async createBlog(data: any) {
    const slug = slugify(data.title, { lower: true });
    return await prisma.blogs.create({
      data: {
        blog_id: data.blog_id,
        title: data.title,
        slug,
        content: data.content,
        description: data.description,
        thumbnail: data.thumbnail,
        type: data.type,
        status: data.status,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        author_id: 21,
      } as any,
    });
  }

  async getBlogByID(blogID: string) {
    return await prisma.blogs.findUnique({
      where: { blog_id: blogID },
    });
  }

  async getAllBlogs() {
    return await prisma.blogs.findMany();
  }

  async updateBlog(data: any) {
    if (!data.blog_id) {
      throw new Error("Blog ID is required");
    }
    // Kiểm tra blog có tồn tại không
    const existingBlog = await prisma.blogs.findUnique({
      where: { blog_id: data.blog_id },
    });
    if (!existingBlog) {
      throw new Error("Blog not found");
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData: any = { ...data };
    if (data.title) {
      updateData.slug = slugify(data.title, { lower: true });
    }

    delete updateData.blog_id;
    updateData.updated_at = new Date();

    // Cập nhật dữ liệu
    const updated = await prisma.blogs.update({
      where: { blog_id: data.blog_id },
      data: updateData,
    });

    return updated;
  }
  async deleteBlog(blogId: string) {
    return await prisma.blogs.delete({
      where: { blog_id: blogId },
    });
  }
}
export default new BlogService();
