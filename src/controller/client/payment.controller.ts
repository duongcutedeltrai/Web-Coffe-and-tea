import { Request, Response } from "express";
import qs from "querystring";
import orderService from "../../services/order.service";
import { PaymentService } from "../../services/payment.service";
import { InfoOrderSchema } from "../../validation/infoOrder.schema";
import promotionService from "../../services/promotion.service";
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}
function generateOrderId() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    let prefix = "OR"; // fallback
    prefix = "DL";
    return `${prefix}_${hh}${mm}${ss}`;
}
class PaymentController {
    async createPayment(req: Request, res: Response) {
        const validate = InfoOrderSchema.safeParse(req.body);
        if (!validate.success) {
            const errorZod = validate.error.issues;
            const errors = errorZod?.map((item) => ({
                field: item.path[0], // tên field trong schema
                message: item.message,
            }));
            return res.status(200).json({ success: false, errors });
        }
        const user_id = (req.user as any)?.id;
        const { totalPrice, promotion_id, address } = req.body;

        const result = await promotionService.applyPromotionByClient(
            +user_id,
            +totalPrice,
            promotion_id
        );
        const totalAmount = result.totalAfterDiscount;
        const url = await PaymentService.createPaymentUrl(totalAmount);
        return res.status(201).json({ url });
        //     try {
        //         const data = req.body;
        //         // 1️⃣ Validate dữ liệu cơ bản
        //         if (
        //             !data.receiver_name ||
        //             !data.receiver_phone ||
        //             !Array.isArray(data.products)
        //         ) {
        //             return res.status(400).json({
        //                 success: false,
        //                 message: "Dữ liệu đơn hàng không hợp lệ",
        //             });
        //         }
        //         // 2️⃣ Tạo đơn hàng trong DB (trạng thái PENDING)
        //         const newOrder = await orderService.createOrder({
        //             ...data,
        //             status: "PENDING",
        //         });
        //         // 3️⃣ Nếu thanh toán bằng VNPAY → tạo URL thanh toán
        //         if (data.payment_method === "vnpay") {
        //             const paymentUrl = await PaymentService.createPaymentUrl(
        //                 newOrder
        //             );
        //             return res.json({
        //                 success: true,
        //                 message: "Tạo đơn hàng thành công, chuyển hướng VNPAY",
        //                 paymentUrl,
        //             });
        //         }
        //         return res.json({
        //             success: true,
        //             message: "Tạo đơn hàng thành công (chưa thanh toán)",
        //             data: newOrder,
        //         });
        //     } catch (error: any) {
        //         console.error("Error creating order:", error);
        //         return res.status(500).json({
        //             success: false,
        //             message: error.message || "Không thể tạo đơn hàng",
        //         });
        //     }
        // }
    }

    async createOrder(req: Request, res: Response) {}
}
export default new PaymentController();
