import { Request, Response } from "express";
import promotionService from "../../services/admin/promotion.service";

class PromotionController {
  async getCreatePromotionPage(req: Request, res: Response) {
    return res.render("admin/promotions/create_promotions.ejs");
  }

  async createPromotion(req: Request, res: Response) {
    try {
      const promotionData = req.body;
      const newPromotion = await promotionService.createPromotion(
        promotionData
      );
      return res.status(201).json({
        success: true,
        data: newPromotion,
        message: "Tạo mã khuyến mãi thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPromotions(req: Request, res: Response) {
    try {
      const promotions = await promotionService.getAllPromotions();
      return res.status(200).json({
        success: true,
        data: promotions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getPromotionById(req: Request, res: Response) {
    try {
      const promotionId = req.params.id;
      const promotion = await promotionService.getPromotionById(promotionId);
      if (!promotion) {
        return res.status(404).json({
          success: false,
          message: "Mã khuyến mãi không tồn tại",
        });
      }
      return res.status(200).json({
        success: true,
        data: promotion,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePromotion(req: Request, res: Response) {
    try {
      const promotionId = req.params.id;
      const promotionData = req.body;
      const updatedPromotion = await promotionService.updatePromotion(
        promotionId,
        promotionData
      );
      return res.status(200).json({
        success: true,
        data: updatedPromotion,
        message: "Cập nhật mã khuyến mãi thành công",
      });
    } catch (error) {
      console.error("Error updating promotion:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
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
