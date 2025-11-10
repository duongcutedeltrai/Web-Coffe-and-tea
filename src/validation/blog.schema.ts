import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  description: z.string().min(1, "Description is required").max(500),
  thumbnail: z.string().optional(),
  type: z.enum(["NEWS", "PROMOTION", "PRODUCT", "EVENT", "GUIDE"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
});

export const updateBlogSchema = createBlogSchema.partial().extend({
  blog_id: z.string().uuid(),
});

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
});

export const createBlogTagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type CreateBlogTagInput = z.infer<typeof createBlogTagSchema>;
