import { prisma } from "../config/client";
import { orders_status } from "@prisma/client";
import cartService from "./cart.service";
import promotionService from "./promotion.service";

class OrderService {
  async getAllOrders(status?: string, type?: string, search?: string) {
    try {
      const whereClause: any = {};

      if (search && search.trim() !== "") {
        const searchStr = search.trim();
        whereClause.AND = [
          ...(status ? [{ status: status as orders_status }] : []),
          ...(type && type !== "all"
            ? [{ order_type: type.toUpperCase() }]
            : []),
          {
            OR: [
              { order_id: { contains: searchStr } },
              { receiver_name: { contains: searchStr } },
              {
                users: {
                  is: {
                    username: { contains: searchStr },
                  },
                },
              },
            ],
          },
        ];
      } else {
        if (status) whereClause.status = status as orders_status;
        if (type && type !== "all")
          whereClause.order_type = type.toUpperCase();
      }

      const orders = await prisma.orders.findMany({
        where: whereClause,
        include: {
          users: {
            select: {
              user_id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
          order_details: {
            include: {
              products: {
                include: {
                  price_product: true,
                },
              },
            },
          },
          payment: {
            select: {
              payment_id: true,
              method: true,
              status: true,
              total_amount: true,
              transaction_date: true,
            },
          },
        },
        orderBy: {
          orderDate: "desc", // Sắp xếp theo ngày đặt hàng mới nhất
        },
      });

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Could not fetch orders");
    }
  }

  async getAllOrdersByUser(
    status?: string,
    type?: string,
    search?: string,
    userId?: number
  ) {
    try {
      const whereClause: any = {
        user_id: userId, // ⭐ Thêm filter user_id vào đầu
      };

      if (search && search.trim() !== "") {
        const searchStr = search.trim();
        whereClause.AND = [
          { user_id: userId },
          ...(status ? [{ status: status as orders_status }] : []),
          ...(type && type !== "all"
            ? [{ order_type: type.toUpperCase() }]
            : []),
          {
            OR: [
              { order_id: { contains: searchStr } },
              { receiver_name: { contains: searchStr } },
              {
                users: {
                  is: {
                    username: { contains: searchStr },
                  },
                },
              },
            ],
          },
        ];
      } else {
        if (status) whereClause.status = status as orders_status;
        if (type && type !== "all")
          whereClause.order_type = type.toUpperCase();
      }

      const orders = await prisma.orders.findMany({
        where: whereClause,
        include: {
          users: {
            select: {
              user_id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
          order_details: {
            include: {
              products: {
                include: {
                  price_product: true,
                },
              },
            },
          },
          payment: {
            select: {
              payment_id: true,
              method: true,
              status: true,
              total_amount: true,
              transaction_date: true,
            },
          },
          promotion_usage: {
            include: {
              promotion: {
                select: {
                  promotion_id: true,
                  discount_percent: true,
                  discount_price: true,
                  type: true,
                },
              },
            },
          },
        },
        orderBy: {
          orderDate: "desc", // Sắp xếp theo ngày đặt hàng mới nhất
        },
      });

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Could not fetch orders");
    }
  }
  async getOrderById(orderId: string) {
    try {
      const order = await prisma.orders.findUnique({
        where: {
          order_id: orderId,
        },
        include: {
          users: {
            select: {
              user_id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
          order_details: {
            include: {
              products: {
                include: {
                  price_product: true,
                },
              },
            },
          },
          payment: true,
          order_status_history: {
            orderBy: {
              changed_at: "desc",
            },
          },
        },
      });

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      return order;
    } catch (error: any) {
      console.error("Error fetching order by ID:", error);
      throw new Error(error.message || "Could not fetch order");
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const existingOrder = await prisma.orders.findUnique({
        where: { order_id: orderId },
        include: { payment: true },
      });

      if (!existingOrder) throw new Error("Không tìm thấy đơn hàng");

      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await prisma.orders.update({
        where: { order_id: orderId },
        data: { status: newStatus as orders_status },
        include: { users: true, payment: true },
      });

      // Ghi log lịch sử
      await prisma.order_status_history.create({
        data: {
          order_id: orderId,
          status: newStatus as any,
          changed_at: new Date(),
        },
      });

      // Nếu đơn là DELIVERY + COD, xử lý thanh toán
      if (
        existingOrder.order_type === "DELIVERY" &&
        existingOrder.payment &&
        existingOrder.payment[0]?.method === "cod"
      ) {
        if (newStatus === "completed") {
          await prisma.payment.updateMany({
            where: { order_id: orderId },
            data: { status: "success" },
          });
        } else if (newStatus === "canceled") {
          await prisma.payment.updateMany({
            where: { order_id: orderId },
            data: { status: "failed" },
          });
        }
      }

      return updatedOrder;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      throw new Error(
        error.message || "Không thể cập nhật trạng thái đơn hàng"
      );
    }
  }
  async createOrder(data: any) {
    try {
      console.log("Creating order with data:", data);
      const totalOriginal = data.products.reduce(
        (sum: number, p: any) => sum + p.price * p.quantity,
        0
      );

      let discountAmount = 0;
      let finalAmount = totalOriginal;
      let validPromotionId: string | null = null;

      // 2️⃣ Kiểm tra nếu có mã khuyến mãi
      if (data.promotion_id) {
        const promotion = await prisma.promotions.findUnique({
          where: { promotion_id: data.promotion_id },
          include: { promotion_products: true },
        });

        if (promotion && promotion.discount_percent) {
          // ✅ Lấy danh sách product_id được áp dụng voucher
          const applicableProducts = promotion.promotion_products.map(
            (p) => p.product_id
          );

          // ✅ Kiểm tra sản phẩm trong đơn có nằm trong danh sách đó không
          const hasApplicableProduct = data.products.some((p: any) =>
            applicableProducts.includes(p.product_id)
          );

          if (hasApplicableProduct) {
            validPromotionId = data.promotion_id;
            discountAmount = Math.floor(
              (promotion.discount_percent.toNumber() / 100) *
              totalOriginal
            );
            finalAmount = totalOriginal - discountAmount;
            console.log(
              `✔️ Áp dụng mã khuyến mãi ${data.promotion_id}: Giảm ${discountAmount}`
            );
          } else {
            console.log(
              "⚠️ Không có sản phẩm nào trong đơn thuộc voucher, bỏ qua mã khuyến mãi."
            );
            throw new Error(
              "Voucher không áp dụng cho sản phẩm trong đơn hàng này"
            );
          }
        }
      }

      const orderData: any = {
        order_id: data.order_id,
        delivery_address: data.delivery_address,
        receiver_name: data.receiver_name,
        receiver_phone: data.receiver_phone,
        order_type: data.order_type,
        order_source: "STAFF",
        status: "pending",
        original_amount: data.original_amount
          ? Math.round(data.original_amount)
          : data.total_amount,
        discount_amount: data.discount_amount
          ? Math.round(data.discount_amount)
          : 0,
        final_amount: data.final_amount
          ? Math.round(data.final_amount)
          : data.total_amount,
      };

      if (!data.user_id && data.receiver_phone) {
        const existingUser = await prisma.users.findUnique({
          where: { phone: data.receiver_phone },
          select: { user_id: true },
        });
        if (existingUser) {
          data.user_id = existingUser.user_id;
          orderData.user_id = existingUser.user_id;
        }
      }
      // 1. Tạo đơn hàng chính
      const order = await prisma.orders.create({
        data: orderData,
      });

      let initialPaymentStatus: "pending" | "success" = "success";
      if (
        data.order_type === "DELIVERY" &&
        data.payment_method === "cod"
      ) {
        initialPaymentStatus = "pending"; // COD chưa thanh toán
      }

      // 2. Tạo chi tiết đơn hàng
      const orderDetails = await prisma.$transaction(
        data.products.map((p: any) =>
          prisma.order_details.create({
            data: {
              order_id: order.order_id,
              product_id: p.product_id,
              quantity: p.quantity,
              price: p.price,
              size: p.size,
            },
          })
        )
      );
      // 2.5. Cập nhật số lượng bán (sold)
      await prisma.$transaction(
        data.products.map((p: any) =>
          prisma.products.update({
            where: { product_id: p.product_id },
            data: {
              sold: { increment: p.quantity },
            },
          })
        )
      );

      // 3. Ghi nhận lịch sử trạng thái
      await prisma.order_status_history.create({
        data: {
          order_id: order.order_id,
          status: "pending",
        },
      });

      // 4. Tạo bản ghi thanh toán
      await prisma.payment.create({
        data: {
          order_id: order.order_id,
          method: data.payment_method.toLowerCase(),
          status: initialPaymentStatus,
          total_amount: data.final_amount,
        },
      });

      //5. Áp dụng mã khuyến mãi nếu có
      if (data.promotion_id) {
        await prisma.promotion_usage.create({
          data: {
            promotion_id: data.promotion_id,
            order_id: order.order_id,
            user_id: data.user_id || null,
            user_phone: data.receiver_phone || null,
          },
        });
      }

      //6. Tạo bản ghi tích điểm nếu có user_id
      if (data.user_id) {
        const earnedPoints = orderData.final_amount
          ? Math.floor(orderData.final_amount / 1000)
          : Math.floor(orderData.original_amount / 1000);
        await prisma.point_history.create({
          data: {
            user_id: data.user_id,
            change: earnedPoints,

            reason: `Tích điểm đơn hàng ${order.order_id}`,
            created_at: new Date(),
          },
        });
        await prisma.users.update({
          where: { user_id: data.user_id },
          data: {
            point: { increment: earnedPoints },
          },
        });
      }

      return { ...order, order_details: orderDetails };
    } catch (error: any) {
      console.error("Error creating order:", error);
      throw new Error(error.message || "Không thể tạo đơn hàng");
    }
  }
  async createOrderByClient(data: any) {
    const cart = await cartService.getCartByUserId(data.user_id);

    // Nếu cart rỗng hoặc chưa có cart_details
    const cartDetails = (cart as any)?.cart_details || [];

    const totalOriginal = cartDetails.reduce((sum: number, item: any) => {
      const price = item.price || 0;
      return sum + price * item.quantity;
    }, 0);
    const productCart = cartDetails.map((p) => ({
      product_id: p.product_id,
      product_size: p.product_size,
      quantity: p.quantity
    }));
    const flashsale =
      await promotionService.getAllPromotionsFlashsaleCurrent();
    const usedPromotions = await prisma.promotion_usage.findMany({
      where: { user_id: data.user_id },
      select: { promotion_id: true, product_id: true },
    });
    const usedSet = new Set(
      usedPromotions
        .filter((u) => u.product_id !== null)
        .map((u) => `${u.promotion_id}_${u.product_id}`)
    );
    let discountAmount = 0;
    let finalAmount = totalOriginal;
    let validPromotionId = [];
    console.log(productCart, flashsale);

    productCart.forEach((cartItem) => {
      flashsale.forEach((promo) => {
        // Nếu product_id trùng
        if (cartItem.product_id === promo.product_id) {
          // Nếu size trùng hoặc flashsale size = "all"
          if (
            promo.size === "all" ||
            promo.size === cartItem.product_size
          ) {
            const key = `${promo.promotion_id}_${promo.product_id}`;

            // ⚠️ Kiểm tra user đã dùng chưa
            if (!usedSet.has(key)) {
              validPromotionId.push({
                promotion_id: promo.promotion_id,
                product_id: promo.product_id,
              });
              discountAmount += (promo.discount_price * cartItem.quantity);
            }
          }
        }
      });
    });
    // Kiểm tra nếu có mã khuyến mãi

    if (data.promotion_id) {
      const promotion = await prisma.promotions.findUnique({
        where: { promotion_id: data.promotion_id },
        include: { promotion_products: true },
      });
      console.log(promotion);
      if (promotion && promotion.discount_percent) {
        //  Lấy danh sách product_id được áp dụng voucher
        const applicableProducts = promotion.promotion_products.map(
          (p) => p.product_id
        );
        console.log(applicableProducts);
        //  Kiểm tra sản phẩm trong đơn có nằm trong danh sách đó không
        const hasApplicableProduct =
          applicableProducts.length === 0 ||
          productCart.some((p: any) =>
            applicableProducts.includes(p.product_id)
          );

        if (hasApplicableProduct) {
          validPromotionId.push({
            promotion_id: data.promotion_id,
            product_id: null,
          });
          discountAmount += Math.floor(
            (promotion.discount_percent.toNumber() / 100) *
            (totalOriginal - discountAmount)
          );
          finalAmount = totalOriginal - discountAmount;
          console.log(
            ` ✔️ Áp dụng mã khuyến mãi ${data.promotion_id}: Giảm ${discountAmount}`
          );
        } else {
          console.log(
            "⚠️ Không có sản phẩm nào trong đơn thuộc voucher, bỏ qua mã khuyến mãi."
          );
          throw new Error(
            "Voucher không áp dụng cho sản phẩm trong đơn hàng này"
          );
        }
      }
    } else {
      finalAmount = totalOriginal - discountAmount;
    }
    const orderData: any = {
      order_id: data.order_id,
      delivery_address: data.delivery_address,
      receiver_name: data.receiver_name,
      receiver_phone: data.receiver_phone,
      order_type: data.order_type,
      order_source: "CUSTOMER",
      status: "completed",
      original_amount: totalOriginal,
      discount_amount: discountAmount,
      final_amount: finalAmount,
    };
    console.log(data.user_id);
    if (data.user_id && data.receiver_phone) {
      const existingUser = await prisma.users.findUnique({
        where: { phone: data.receiver_phone },
        select: { user_id: true },
      });
      if (existingUser) {
        orderData.user_id = data.user_id;
      } else {
        console.log(existingUser);
        await prisma.users.update({
          where: { user_id: data.user_id },
          data: {
            phone: data.receiver_phone, // số điện thoại (có thể trùng)
            address: data.delivery_address, // địa chỉ
          },
        });
        orderData.user_id = data.user_id;
      }
    }
    // 1. Tạo đơn hàng chính
    const order = await prisma.orders.create({
      data: orderData,
    });

    let initialPaymentStatus: "pending" | "success" = "success";
    if (data.order_type === "DELIVERY" && data.payment_method === "cod") {
      initialPaymentStatus = "pending"; // COD chưa thanh toán
    }

    // 2. Tạo chi tiết đơn hàng
    const orderDetails = await prisma.$transaction(
      cartDetails.map((p: any) =>
        prisma.order_details.create({
          data: {
            order_id: order.order_id,
            product_id: p.product_id,
            quantity: p.quantity,
            price: p.price,
            size: p.product_size,
          },
        })
      )
    );
    // 2.5. Cập nhật số lượng bán (sold)
    await prisma.$transaction(
      cartDetails.map((p: any) =>
        prisma.products.update({
          where: { product_id: p.product_id },
          data: {
            sold: { increment: p.quantity },
          },
        })
      )
    );

    // 3. Ghi nhận lịch sử trạng thái
    await prisma.order_status_history.create({
      data: {
        order_id: order.order_id,
        status: "ready",
      },
    });
    // console.log(data);
    // 4. Tạo bản ghi thanh toán
    await prisma.payment.create({
      data: {
        order_id: order.order_id,
        method: data.payment_method.toLowerCase(),
        status: initialPaymentStatus,
        total_amount: finalAmount,
      },
    });
    console.log(validPromotionId);
    console.log(data.promotion_id);
    //5. Áp dụng mã khuyến mãi nếu có
    if (validPromotionId) {
      for (const promo of validPromotionId) {
        await prisma.promotion_usage.create({
          data: {
            promotion_id: promo.promotion_id,
            order_id: order.order_id,
            user_id: data.user_id || null,
            user_phone: data.receiver_phone || null,
            product_id: promo.product_id,
          },
        });
      }
    }

    //6. Tạo bản ghi tích điểm nếu có user_id
    if (data.user_id) {
      const earnedPoints = orderData.final_amount
        ? Math.floor(orderData.final_amount / 1000)
        : Math.floor(orderData.original_amount / 1000);
      await prisma.point_history.create({
        data: {
          user_id: data.user_id,
          change: earnedPoints,

          reason: `Tích điểm đơn hàng ${order.order_id}`,
          created_at: new Date(),
        },
      });
      await prisma.users.update({
        where: { user_id: data.user_id },
        data: {
          point: { increment: earnedPoints },
        },
      });
    }
    if (cart) {
      // 1. Đặt tổng tiền cart về 0
      await prisma.cart.update({
        where: { user_id: data.user_id },
        data: { total: 0, quantity: 0 },
      });

      // 2. Xóa tất cả cart_details
      await prisma.cart_details.deleteMany({
        where: { cart_id: (cart as any)?.cart_id },
      });
    }

    return { ...order, order_details: orderDetails };
  }
  catch(error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.message || "Không thể tạo đơn hàng");
  }
}

export default new OrderService();