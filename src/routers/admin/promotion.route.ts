import express from "express";
import promotionController from "../../controller/admin/promotion.controller";
import {
  authMiddleware, roleMiddleware,
  authAndRoleMiddleware,
  adminStaffGuard,
} from "../../middleware/auth.middleware";

const promotionRoute = express.Router();
const promotionDataRoute = express.Router();

promotionRoute.get("/promotions", authAndRoleMiddleware,
  adminStaffGuard, promotionController.getCreatePromotionPage);
promotionRoute.get(
  "/promotions/:id",
  promotionController.getCreatePromotionPage
);
promotionRoute.get(
  "/valid-vouchers/:total",
  authMiddleware,
  promotionController.getValidVouchers
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
  "/data/promotions/apply-promotion",
  authMiddleware,
  promotionController.applyPromotionByCustomer
);
promotionDataRoute.post(
  "/data/promotions/create",
  promotionController.createPromotion
);

promotionDataRoute.get(
  "/data/promotions/voucher",
  promotionController.getAllPromotionsVoucher
);
promotionDataRoute.get(
  "/data/promotions/flashsale",
  authMiddleware,
  promotionController.getAllPromotionsFlashsale
);
promotionDataRoute.get(
  "/data/promotions/:id",
  promotionController.getPromotionById
);
promotionDataRoute.get(
  "/data/promotions/flashsale/client",
  authMiddleware,
  promotionController.getAllPromotionsFlashsaleClient
);

promotionDataRoute.put(
  "/data/promotions/update/:id",
  promotionController.updatePromotion
);

export { promotionRoute, promotionDataRoute };