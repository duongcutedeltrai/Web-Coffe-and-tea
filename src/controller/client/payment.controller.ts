import { Request, Response } from "express";
import qs from "querystring";
import orderService from "../../services/order.service";
import { PaymentService } from "../../services/payment.service";
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}
class PaymentController {
    async createOrder(req: Request, res: Response) {
        try {
            const data = req.body;

            // 1️⃣ Validate dữ liệu cơ bản
            if (
                !data.receiver_name ||
                !data.receiver_phone ||
                !Array.isArray(data.products)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Dữ liệu đơn hàng không hợp lệ",
                });
            }

            // 2️⃣ Tạo đơn hàng trong DB (trạng thái PENDING)
            const newOrder = await orderService.createOrder({
                ...data,
                status: "PENDING",
            });

            // 3️⃣ Nếu thanh toán bằng VNPAY → tạo URL thanh toán
            if (data.payment_method === "vnpay") {
                const paymentUrl = await PaymentService.createPaymentUrl(
                    newOrder
                );
                return res.json({
                    success: true,
                    message: "Tạo đơn hàng thành công, chuyển hướng VNPAY",
                    paymentUrl,
                });
            }

            return res.json({
                success: true,
                message: "Tạo đơn hàng thành công (chưa thanh toán)",
                data: newOrder,
            });
        } catch (error: any) {
            console.error("Error creating order:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Không thể tạo đơn hàng",
            });
        }
    }
}
export default new PaymentController();
