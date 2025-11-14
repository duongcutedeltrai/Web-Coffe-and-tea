import { Request, Response } from "express";
import promotionService from "../../services/promotion.service";

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

  async getAllPromotionsVoucher(req: Request, res: Response) {
    try {
      const promotions = await promotionService.getAllPromotionsVoucher();
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
  async getValidVouchers(req: Request, res: Response) {
    try {
      const user_id = (req.user as any)?.id;
      const totalPrice = req.params.total;
      const data = await promotionService.getValidVouchers(
        +user_id,
        +totalPrice
      );

      res.json({
        success: true,
        count: data.length,
        vouchers: data,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async getAllPromotionsFlashsale(req: Request, res: Response) {
    try {
      const promotions =
        await promotionService.getAllPromotionsFlashsale();
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
      const promotion = await promotionService.getPromotionById(
        promotionId
      );
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

  // async applyPromotionByCustomer(req: Request, res: Response) {
  //     try {
  //         const user_id = (req.user as any)?.id;
  //         const { code, orderAmount, phone } = req.body;
  //         if (!code || !orderAmount || !phone) {
  //             return res.status(400).json({
  //                 success: false,
  //                 message:
  //                     "Thiếu thông tin cần thiết để áp dụng mã khuyến mãi",
  //             });
  //         }
  //         const result = await promotionService.applyPromotion(
  //             code,
  //             orderAmount,
  //             user_id,
  //             phone
  //         );
  //         return res.status(200).json({
  //             success: true,
  //             data: result,
  //         });
  //     } catch (error) {
  //         return res.status(500).json({
  //             success: false,
  //             message: error.message,
  //         });
  //     }
  // }
  // controller/promotionController.ts
  async applyPromotionByCustomer(req: Request, res: Response) {
    try {
      const user_id = (req.user as any)?.id;
      const { totalPrice, promotion_id } = req.body;

      const result = await promotionService.applyPromotionByClient(
        +user_id,
        +totalPrice,
        promotion_id
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async applyPromotion(req: Request, res: Response) {
    try {
      const { code, orderAmount, userId, phone } = req.body;
      if (!code || !orderAmount || !phone) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin cần thiết để áp dụng mã khuyến mãi",
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