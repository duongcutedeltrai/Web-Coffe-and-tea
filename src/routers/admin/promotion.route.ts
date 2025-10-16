import express from "express";
import promotionController from "../../controller/admin/promotion.controller";
const promotionRoute = express.Router();
const promotionDataRoute = express.Router();

promotionDataRoute.post(
  "/data/promotions/apply",
  promotionController.applyPromotion
);
promotionRoute.get("/promotions", promotionController.getCreatePromotionPage);

export { promotionRoute, promotionDataRoute };
