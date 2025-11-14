import express from "express";
import favoritesController from "../../controller/client/favorites.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const favoriteRouteAPI = express.Router();

favoriteRouteAPI.get("/favorite",authMiddleware,favoritesController.getFavoritesByUserId);

favoriteRouteAPI.post("/favorite",authMiddleware,favoritesController.addFavorite);
favoriteRouteAPI.delete("/favorite",authMiddleware,favoritesController.removeFavorite);


export default favoriteRouteAPI;