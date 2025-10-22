import express from "express";
import promotionController from "../../controller/admin/promotion.controller";
const promotionRoute = express.Router();
const promotionDataRoute = express.Router();

promotionRoute.get("/promotions", promotionController.getCreatePromotionPage);
promotionRoute.get(
  "/promotions/:id",
  promotionController.getCreatePromotionPage
);
promotionRoute.get(
  "/promotions/update/:id",
  promotionController.getCreatePromotionPage
);
promotionRoute.get(
  "/promotions/create",
  promotionController.getCreatePromotionPage
);

promotionDataRoute.post(
  "/data/promotions/apply",
  promotionController.applyPromotion
);
promotionDataRoute.post(
  "/data/promotions/create",
  promotionController.createPromotion
);

promotionDataRoute.get(
  "/data/promotions",
  promotionController.getAllPromotions
);

promotionDataRoute.get(
  "/data/promotions/:id",
  promotionController.getPromotionById
);

promotionDataRoute.put(
  "/data/promotions/update/:id",
  promotionController.updatePromotion
);
export { promotionRoute, promotionDataRoute };
