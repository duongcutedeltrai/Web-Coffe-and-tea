import { prisma } from "../../config/client";

class AdminCategoryService {
    async getAllCategories() {
        try {
            const result = await prisma.categories.findMany({
                where: { deleted_at: null },
                include: { products: true },
            });
            const categoriesWithProductsCount = result.map((category) => ({
                ...category,
                productsCount: category.products.length,
            }));
            return categoriesWithProductsCount;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    async createNewCategory(data: any) {
        try {
            const newCategory = await prisma.categories.create({
                data: {
                    name: data.groupName,
                    description: data.groupDescription,
                    images: data.image,
                },
            });
            return newCategory;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    }
    async getCategoryById(id: number) {
        return prisma.categories.findUnique({ where: { category_id: id } });
    }

    async updateCategory(id: number, data: any) {
        try {
            const result = await prisma.categories.update({
                where: { category_id: id },
                data: {
                    name: data.groupName,
                    description: data.groupDescription,
                    images: data.images,
                    created_at: new Date(),
                },
            });
            return result;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    }
    async deleteCategory(id: number) {
        try {
            await prisma.products.updateMany({
                where: { category_id: id },
                data: { category_id: null },
            });
            const result = await prisma.categories.update({
                where: { category_id: id },
                data: { deleted_at: new Date() },
                include: { products: true },
            });
            return result;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
}

export default new AdminCategoryService();
