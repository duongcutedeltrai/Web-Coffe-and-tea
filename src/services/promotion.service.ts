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
            throw new Error("Failed to create promotion");
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
                usage.user_id === userId ||
                (phone && usage.user_phone === phone)
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
        const discountAmount = await this.calculateDiscount(
            promotion,
            orderAmount
        );

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
    // async applyPromotionByClientDemo(
    //     code: string,
    //     orderAmount: number,
    //     userId?: number
    // ) {
    //     // 1️⃣ Xác thực mã khuyến mãi
    //     const validation = await this.validatePromotionByCode(code, userId);
    //     if (!validation.valid) {
    //         throw new Error(validation.message);
    //     }

    //     const promotion = validation.promotion;

    //     // 2️⃣ Tính tiền giảm
    //     const discountAmount = await this.calculateDiscount(promotion, orderAmount);

    //     // 3️⃣ Tính tổng tiền sau giảm
    //     const finalAmount = orderAmount - discountAmount;

    //     // 4️⃣ Trả về kết quả chi tiết
    //     return {
    //         promotionId: promotion.promotion_id,
    //         code: promotion.code,
    //         originalAmount: orderAmount,
    //         discountAmount,
    //         finalAmount,
    //         discountPercent: promotion.discount_percent,
    //         message: `Giảm ${discountAmount.toLocaleString()}₫, tổng còn ${finalAmount.toLocaleString()}₫`,
    //     };
    // }
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
                message:
                    "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng khuyến mãi.",
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

        if (!cart)
            return { success: false, message: "Không tìm thấy giỏ hàng." };

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
                message:
                    "Mã khuyến mãi không áp dụng cho sản phẩm trong giỏ hàng.",
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
            if (voucher.start_date > now || voucher.end_date < now)
                isValid = false;

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