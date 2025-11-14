import favoritesService from "../../services/favorites.service";

class favoriteController{
    async getFavoritesByUserId(req, res) {
        try {
            const userId = (req.user as any)?.id;
            const favorites = await favoritesService.getUserFavorites(userId);
            return res.json({ total: favorites.length,favorites });
        } catch (error) {
            console.error("Error in getFavoritesByUserId:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
    async addFavorite(req, res) {
        try {
            const userId = (req.user as any)?.id;
            const { productId } = req.body;
            const favorite = await favoritesService.createFavorite(+userId, +productId);
            return res.status(201).json({ favorite });
        } catch (error) {
            console.error("Error in addFavorite:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
    async removeFavorite(req, res) {
        try {
            const userId =(req.user as any)?.id;
            const { productId } = req.body;
            const result = await favoritesService.removeFavorite(+userId, +productId);
            return res.json(result);
        } catch (error) {
            console.error("Error in removeFavorite:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
  
}
export default new favoriteController();