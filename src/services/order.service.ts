import { prisma } from "../config/client";
import { orders_status } from "@prisma/client";

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
    async createOrder(data: any) {
        try {
            console.log("Creating order with data:", data);
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
                promotion_id: data.promotion_id,
            };

            // if (data.user_id) {
            //   orderData.user_id = data.user_id;
            // }
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
                    total_amount: data.total_amount,
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
}

export default new OrderService();
