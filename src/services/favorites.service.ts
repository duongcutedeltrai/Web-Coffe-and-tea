import { prisma } from "../config/client"

class FavoritesService{
    createFavorite = async (user_id: number, product_id: number) => {
 
        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                userId: user_id,
                productId:product_id}
            });
        if (existingFavorite) {
            throw new Error("Sản phẩm đã có trong danh sách yêu thích");
        }
        const favorite = await prisma.favorite.create({
            data: {
                userId: user_id,
                productId: product_id,
            },
        });
        return favorite;
    }
    removeFavorite = async (user_id: number, product_id: number) => {
        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                userId: user_id,
                productId:product_id}
            });
        if (!existingFavorite) {
            throw new Error("Sản phẩm không có trong danh sách yêu thích");
        }
        await prisma.favorite.delete({
            where: {
                favorite_id: existingFavorite.favorite_id,
            },
        });
        return { message: "Đã xóa sản phẩm khỏi danh sách yêu thích" };
    }
    getUserFavorites = async (user_id: number) => {
        const favorites = await prisma.favorite.findMany({
            where: { userId: user_id },
            include: { 
                product:{
                    include: { 
                        categories: true , 
                        price_product: true,
                    }
                }
             },
        });
        return favorites.map(fav => fav.product);
    }
}
export default new FavoritesService();