import { da } from "zod/v4/locales";
import { prisma } from "../config/client";
import slugify from "slugify";
import axios from "axios";

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
        author_id: data.author_id,
      } as any,
    });
  }
    async incrementView(blogId: string) {
        return prisma.blogs.update({
            where: { blog_id: blogId },
            data: {
                view_count: {
                    increment: 1, // tăng 1
                },
            },
        });
    }
 async getPublishedBlogs() {
        try {
            const blogs = await prisma.blogs.findMany({
                where: {
                    status: "PUBLISHED", // chỉ lấy blog đã xuất bản
                },
                orderBy: {
                    published_at: "desc", // sắp xếp theo ngày xuất bản mới nhất
                },
            });
            return blogs;
        } catch (error) {
            console.error("Error fetching published blogs:", error);
            throw error;
        }
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
async  generateBlogAI(prompt) {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
        console.error("Missing HF_API_KEY");
        return { error: "Lỗi cấu hình API." };
    }

    const model = "mistralai/mistral-7b-instruct:free";
    console.log("Using OpenRouter model:", model);

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: model,
                messages: [
                    { role: "system", content: "Bạn là trợ lý viết blog." },
                    {
                        role: "user",
                        content: `Viết blog theo prompt sau, trả về **chỉ JSON thuần** với các trường: title, slug, description, content (HTML), meta_title, meta_description. Nội dung blog cho quán cà phê Phê La: ${prompt}`
                    }
                ],
                max_tokens: 1100,
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // OpenRouter trả về array choices
        const text = response.data.choices?.[0]?.message?.content || "{}";
        console.log(text);
const cleanedText = cleanAIJSON(text);
        // Try parse JSON
        try {
            return JSON.parse(cleanedText);
        } catch (parseErr) {
            console.warn("Không parse được JSON, trả về text thô:", parseErr);
            return {
                title: "",
                slug: "",
                description: "",
                content: text,
                meta_title: "",
                meta_description: ""
            };
        }

    } catch (err) {
        console.error("Lỗi khi gọi OpenRouter:", err.message || err);
        return {
            title: "",
            slug: "",
            description: "",
            content: "",
            meta_title: "",
            meta_description: ""
        };
    }
}
}
function cleanAIJSON(text: string) {
    // Remove instruction tokens và code block
    return text
        .replace(/<s>\s*\[\/INST\]\s*/g, "") // bỏ <s> [/INST]
        .replace(/```json\s*/i, "")          // bỏ ```json
        .replace(/```/g, "")                  // bỏ ```
        .trim();
}

export default new BlogService();