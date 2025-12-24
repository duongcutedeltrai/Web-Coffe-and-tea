import { product } from "src/routers/client/product.route";
import { prisma } from "../config/client";
class PromotionService {
  async createPromotion(data: any) {
    try {
      const promotionData: any = {
        code: data.code || null,
        promotion_id: data.promotion_id,
        description: data.description || null,
        discount_percent: data.discount_percent || null,
        discount_price: data.discount_price || null,
        min_order_amount: data.min_order_amount || null,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        is_active: data.is_active || true,
        is_for_new_user: data.is_for_new_user || false,
        applicable_membership: data.applicable_membership || null,
        max_usage_count: data.max_usage_count || null,
        type: data.type || "voucher",
      };

      console.log("applicable_products:", data.applicable_products);
      //kiem tra xem san pham trong danh sach truyen xuong co dang co flash sale khong
      if (data.type === "flashsale" && data.applicable_products !== "all") {
        const now = new Date();
        for (const item of data.applicable_products) {
          const existingFlashsale = await prisma.promotions.findFirst({
            where: {
              type: "flashsale",
              promotion_products: {
                some: {
                  product_id: item.productId,
                },
              },
              AND: [{ start_date: { lte: now } }, { end_date: { gte: now } }],
            },
            include: {
              promotion_products: {
                include: { products: true },
              },
            },
          });
          if (existingFlashsale) {
            const matched = existingFlashsale.promotion_products.find(
              (pp: any) => pp.product_id === item.productId
            );
            const productName =
              matched?.products?.name ?? `ID ${item.productId}`;
            throw new Error(
              `Sản phẩm ${productName} đã có flash sale đang diễn ra. Vui lòng chọn sản phẩm khác hoặc thay đổi thời gian khuyến mãi.`
            );
          }
        }
      }

      await prisma.promotions.create({
        data: promotionData,
      });
      if (data.applicable_products !== "all") {
        await prisma.promotion_products.createMany({
          data: data.applicable_products.map((item: any) => ({
            promotion_id: data.promotion_id,
            product_id: item.productId,
            size: item.size,
          })),
        });
      }

      return promotionData;
    } catch (error) {
      console.error("Error creating promotion:", error);
      throw new Error(error.message || error);
    }
  }

  async getAllPromotionsVoucher() {
    try {
      const promotions = await prisma.promotions.findMany({
        where: { type: "voucher" },
        include: {
          promotion_products: true,
          promotion_usage: true,
        },
      });
      return promotions;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      return [];
    }
  }
  async getAllPromotionsFlashsale() {
    try {
      const promotions = await prisma.promotions.findMany({
        where: { type: "flashsale" },
        include: {
          promotion_products: {
            include: {
              products: {
                include: { price_product: true },
              },
            },
          },
          promotion_usage: true,
        },
      });
      return promotions;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      return [];
    }
  }

  async getPromotionById(promotionId: string) {
    try {
      const promotion = await prisma.promotions.findUnique({
        where: { promotion_id: promotionId },
        include: {
          promotion_products: true,
          promotion_usage: true,
        },
      });
      return promotion;
    } catch (error) {
      console.error("Error fetching promotion by ID:", error);
      return null;
    }
  }

  async updatePromotion(promotionId: string, data: any) {
    try {
      // 1. Cập nhật bảng chính
      const updated = await prisma.promotions.update({
        where: { promotion_id: promotionId },
        data: {
          code: data.code,
          description: data.description || null,
          discount_percent: data.discount_percent || null,
          min_order_amount: data.min_order_amount || null,
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          is_active: data.is_active ?? true,
          is_for_new_user: data.is_for_new_user || false,
          applicable_membership: data.applicable_membership || null,
          max_usage_count: data.max_usage_count || null,
        },
      });

      // 2. Cập nhật sản phẩm áp dụng
      await prisma.promotion_products.deleteMany({
        where: { promotion_id: promotionId },
      });

      if (data.applicable_products !== "all") {
        await prisma.promotion_products.createMany({
          data: data.applicable_products.map((item: any) => ({
            promotion_id: promotionId,
            product_id: item.productId,
            size: item.size,
          })),
        });
      }

      return updated;
    } catch (error) {
      console.error("Error updating promotion:", error);
      throw new Error("Failed to update promotion");
    }
  }

  async validatePromotion(
    code: string,
    orderAmount: number,
    userId?: number,
    phone?: string
  ) {
    console.log(code, orderAmount, userId, phone);
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
    // ✅ Nếu chưa có userId nhưng có số điện thoại, cố gắng truy ra user
    let resolvedUserId = userId;
    let resolvedMembership: string | undefined;
    if (!resolvedUserId && phone) {
      const foundUser = await prisma.users.findFirst({
        where: { phone },
        select: { user_id: true, membership: true },
      });
      if (foundUser) {
        resolvedUserId = foundUser.user_id;
        resolvedMembership = foundUser.membership;
      }
    }

    // 🔹 Kiểm tra điều kiện chỉ dành cho khách hàng mới
    if (promotion.is_for_new_user && resolvedUserId) {
      const userOrderCount = await prisma.orders.count({
        where: { user_id: resolvedUserId },
      });

      if (userOrderCount > 0) {
        return {
          valid: false,
          promotion: null,
          message: "Mã khuyến mãi chỉ dành cho khách hàng mới",
        };
      }
    }

    // 🔹 Kiểm tra hạng thành viên áp dụng
    if (
      promotion.applicable_membership &&
      (resolvedUserId || resolvedMembership)
    ) {
      // Lấy membership nếu chưa có
      let userMembership = resolvedMembership;
      if (!userMembership && resolvedUserId) {
        const user = await prisma.users.findUnique({
          where: { user_id: resolvedUserId },
          select: { membership: true },
        });
        userMembership = user?.membership;
      }

      const allowedMemberships = Array.isArray(
        promotion.applicable_membership as any
      )
        ? (promotion.applicable_membership as any as string[])
        : [promotion.applicable_membership as any as string];

      if (
        allowedMemberships.length > 0 &&
        (!userMembership || !allowedMemberships.includes(userMembership))
      ) {
        return {
          valid: false,
          promotion: null,
          message: `Mã khuyến mãi chỉ dành cho các hạng thành viên: ${allowedMemberships.join(
            ", "
          )}`,
        };
      }
      console.log("User membership:", userMembership);
    }
    let usedPromotion = null;
    // Ưu tiên kiểm tra theo userId đã được resolve
    if (resolvedUserId) {
      usedPromotion = promotion.promotion_usage.find(
        (usage) => usage.user_id === resolvedUserId
      );
    }
    // Nếu không có userId thì mới check theo phone
    if (!usedPromotion && phone) {
      usedPromotion = promotion.promotion_usage.find(
        (usage) => usage.user_phone === phone
      );
    }
    console.log("Checking promotion usage:", {
      userId,
      phone,
      promotion_usage: promotion.promotion_usage,
      usedPromotion,
    });
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
        promotion_id: promotionId.toString(),
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
    phone?: string,
    products?: { product_id: number; size?: string }[]
  ) {
    // 1️⃣ Validate cơ bản
    const validation = await this.validatePromotion(
      code,
      orderAmount,
      userId,
      phone
    );
    if (!validation.valid) throw new Error(validation.message);

    const promotion = await prisma.promotions.findUnique({
      where: { code },
      include: { promotion_products: true },
    });

    if (!promotion) throw new Error("Không tìm thấy mã khuyến mãi");
    // 2️⃣ Kiểm tra sản phẩm hợp lệ nếu voucher chỉ áp dụng cho một số sản phẩm
    if (
      promotion.promotion_products.length > 0 &&
      products &&
      products.length > 0
    ) {
      const applicableProducts = promotion.promotion_products.map(
        (p) => p.product_id
      );

      const hasApplicableProduct = products.some((p) =>
        applicableProducts.includes(p.product_id)
      );

      if (!hasApplicableProduct) {
        throw new Error(
          "Mã voucher không áp dụng cho sản phẩm trong đơn hàng này"
        );
      }
    }

    // 3️⃣ Tính giảm giá (theo phần trăm)
    const percent = promotion.discount_percent?.toNumber() || 0;
    const discountAmount = Math.floor((percent / 100) * orderAmount);
    const finalAmount = orderAmount - discountAmount;

    return {
      success: true,
      message: "Áp dụng voucher thành công",
      data: {
        promotionId: promotion.promotion_id,
        discountPercent: percent,
        discountAmount,
        finalAmount,
        originalAmount: orderAmount,
        code: code,
      },
    };
  }

  async applyPromotionByClient(
    userId: number,
    totalPrice: number,
    promotion_id: string
  ) {
    const now = new Date();

    // 🔹 Lấy thông tin promotion theo ID
    const promotion = await prisma.promotions.findUnique({
      where: { promotion_id },
      include: {
        promotion_products: true,
      },
    });

    if (!promotion) {
      return { success: false, message: "Mã khuyến mãi không tồn tại." };
    }

    // 🔹 Kiểm tra trạng thái active
    if (!promotion.is_active) {
      return {
        success: false,
        message: "Khuyến mãi không còn hoạt động.",
      };
    }

    // 🔹 Kiểm tra thời gian hiệu lực
    if (promotion.start_date > now || promotion.end_date < now) {
      return {
        success: false,
        message: "Khuyến mãi đã hết hạn hoặc chưa bắt đầu.",
      };
    }

    // 🔹 Kiểm tra điều kiện đơn hàng tối thiểu
    if (
      promotion.min_order_amount &&
      totalPrice < Number(promotion.min_order_amount)
    ) {
      return {
        success: false,
        message: "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng khuyến mãi.",
      };
    }

    // 🔹 Kiểm tra người dùng đã dùng voucher này chưa
    const usedBefore = await prisma.promotion_usage.findFirst({
      where: { user_id: userId, promotion_id },
    });
    if (usedBefore) {
      return {
        success: false,
        message: "Bạn đã sử dụng mã khuyến mãi này rồi.",
      };
    }

    // 🔹 Nếu voucher chỉ áp dụng cho sản phẩm cụ thể, kiểm tra giỏ hàng
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_details: { include: { products: true } },
      },
    });

    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng." };

    const productIdsInCart = cart.cart_details.map((d) => d.product_id);
    const promoProductIds = promotion.promotion_products.map(
      (p) => p.product_id
    );

    const hasApplicableProduct =
      promoProductIds.length === 0 ||
      promoProductIds.some((pid) => productIdsInCart.includes(pid));

    if (!hasApplicableProduct) {
      return {
        success: false,
        message: "Mã khuyến mãi không áp dụng cho sản phẩm trong giỏ hàng.",
      };
    }

    // 🔹 Tính giảm giá
    let discountPrice = 0;
    if (promotion.discount_price && promotion.discount_price > 0) {
      discountPrice = promotion.discount_price;
    } else if (
      promotion.discount_percent &&
      Number(promotion.discount_percent) > 0
    ) {
      discountPrice = Math.floor(
        (Number(promotion.discount_percent) / 100) * totalPrice
      );
    }

    // ✅ Nếu hợp lệ → trả về kết quả
    return {
      success: true,
      message: "Áp dụng khuyến mãi thành công.",
      discountPrice,
      totalAfterDiscount: totalPrice - discountPrice,
      promotion,
    };
  }
  async getValidVouchers(userId: number, totalPrice: number) {
    // console.log(userId);
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cart_details: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!cart) throw new Error("Cart not found.");

    const now = new Date();

    // 2️⃣ Lấy toàn bộ voucher (type = voucher)
    const vouchers = await prisma.promotions.findMany({
      where: { type: "voucher" },
      include: {
        promotion_products: true,
      },
    });

    // 3️⃣ Duyệt từng voucher và kiểm tra điều kiện
    const result = vouchers.map((voucher) => {
      let isValid = true;

      // ⚡ Kiểm tra active
      if (!voucher.is_active) isValid = false;

      // ⏰ Kiểm tra thời gian hợp lệ
      if (voucher.start_date > now || voucher.end_date < now) isValid = false;

      // 💰 Kiểm tra giá trị đơn hàng tối thiểu
      if (
        voucher.min_order_amount &&
        totalPrice < Number(voucher.min_order_amount)
      )
        isValid = false;

      // 🧃 Kiểm tra sản phẩm có nằm trong danh sách voucher
      const productIdsInCart = cart.cart_details.map((d) => d.product_id);
      const promoProductIds = voucher.promotion_products.map(
        (p) => p.product_id
      );

      const hasApplicableProduct =
        promoProductIds.length === 0 ||
        promoProductIds.some((pid) => productIdsInCart.includes(pid));
      if (!hasApplicableProduct) isValid = false;

      return {
        ...voucher,
        is_valid: isValid,
      };
    });

    return result;
  }
}
export default new PromotionService();
