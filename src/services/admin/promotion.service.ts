import { prisma } from "../../config/client";
class PromotionService {
  async validatePromotion(
    code: string,
    orderAmount: number,
    userId?: number,
    phone?: string
  ) {
    const promotion = await prisma.promotions.findUnique({
      where: { code },
      include: { promotion_usage: true },
    });
    if (!promotion) {
      return {
        valid: false,
        promotion: null,
        message: "Không tìm thấy mã khuyến mãi",
      };
    }
    if (promotion.is_active === false) {
      return {
        valid: false,
        promotion: null,
        message: "Mã khuyến mãi không hợp lệ",
      };
    }
    if (promotion.end_date < new Date()) {
      return {
        valid: false,
        promotion: null,
        message: "Mã khuyến mãi đã hết hạn",
      };
    }
    if (promotion.start_date > new Date()) {
      return {
        valid: false,
        promotion: null,
        message: "Mã khuyến mãi chưa bắt đầu",
      };
    }
    if (
      promotion.max_usage_count !== null &&
      promotion.max_usage_count <= promotion.promotion_usage.length
    ) {
      return {
        valid: false,
        promotion: null,
        message: "Đã đạt giới hạn sử dụng mã khuyến mãi",
      };
    }
    if (
      promotion.min_order_amount &&
      orderAmount < promotion.min_order_amount.toNumber()
    ) {
      return {
        valid: false,
        promotion: null,
        message: `Giá trị đơn hàng tối thiểu là ${promotion.min_order_amount}`,
      };
    }
    if (promotion.is_for_new_user && userId) {
      const userOrderCount = await prisma.orders.count({
        where: { user_id: userId },
      });

      if (userOrderCount > 0) {
        return {
          valid: false,
          promotion: null,
          message: "Mã khuyến mãi chỉ dành cho khách hàng mới",
        };
      }
    }
    if (promotion.applicable_membership && userId) {
      const user = await prisma.users.findUnique({
        where: { user_id: userId },
      });

      if (user?.membership !== promotion.applicable_membership) {
        return {
          valid: false,
          promotion: null,
          message: `Mã khuyến mãi chỉ dành cho thành viên ${promotion.applicable_membership}`,
        };
      }
    }

    const usedPromotion = promotion.promotion_usage.find(
      (usage) =>
        usage.user_id === userId || (phone && usage.user_phone === phone)
    );
    console.log("Used promotion:", usedPromotion);
    if (usedPromotion) {
      return {
        valid: false,
        promotion: null,
        message: "Bạn đã sử dụng mã khuyến mãi này",
      };
    }

    return {
      valid: true,
      promotion,
    };
  }

  async calculateDiscount(promotion: any, orderAmount: number) {
    let discountAmount = 0;

    if (promotion.discount_percent) {
      discountAmount =
        (orderAmount * promotion.discount_percent.toNumber()) / 100;
    } else if (promotion.discount_amount) {
      discountAmount = Math.min(
        promotion.discount_amount.toNumber(),
        orderAmount
      ); // Không giảm quá tổng tiền
    }

    return discountAmount;
  }

  async recordPromotionUsage(
    promotionId: number,
    orderId: string,
    userId?: number,
    phone?: string
  ) {
    return await prisma.promotion_usage.create({
      data: {
        promotion_id: promotionId,
        order_id: orderId,
        user_id: userId,
        user_phone: phone,
      },
    });
  }

  async applyPromotion(
    code: string,
    orderAmount: number,
    userId?: number,
    phone?: string
  ) {
    // 1. Validate promotion
    const validation = await this.validatePromotion(
      code,
      orderAmount,
      userId,
      phone
    );

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const promotion = validation.promotion;

    // 2. Calculate discount
    const discountAmount = await this.calculateDiscount(promotion, orderAmount);

    // 3. Calculate final amount
    const finalAmount = orderAmount - discountAmount;

    return {
      promotionId: promotion.promotion_id,
      originalAmount: orderAmount,
      discountAmount,
      finalAmount,
      discountPercent: promotion.discount_percent,
    };
  }
}
export default new PromotionService();
