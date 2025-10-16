import { Request, Response } from "express";
import promotionService from "../../services/admin/promotion.service";

class PromotionController {
  async getCreatePromotionPage(req: Request, res: Response) {
    return res.render("admin/promotions/create_promotions.ejs");
  }

  async applyPromotion(req: Request, res: Response) {
    try {
      const { code, orderAmount, userId, phone } = req.body;
      if (!code || !orderAmount || !phone) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin cần thiết để áp dụng mã khuyến mãi",
        });
      }
      const result = await promotionService.applyPromotion(
        code,
        orderAmount,
        userId,
        phone
      );
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
export default new PromotionController();
