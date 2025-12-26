import { Request, Response } from "express";
import orderService from "../../services/order.service";
import promotionService from "../../services/promotion.service";
import { PaymentService } from "../../services/payment.service";
import { InfoOrderSchema } from "../../validation/infoOrder.schema";
import {
    IpnFailChecksum,
    IpnOrderNotFound,
    IpnInvalidAmount,
    InpOrderAlreadyConfirmed,
    IpnUnknownError,
    IpnSuccess,
} from "vnpay";
import userService from "../../services/user.service";

function generateOrderId() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `DL_${pad(now.getHours())}${pad(now.getMinutes())}${pad(
        now.getSeconds()
    )}`;
}

class PaymentController {
    // Bước 1: Tạo thanh toán
    async createPayment(req: Request, res: Response) {
        console.log(req.body);
        const validate = InfoOrderSchema.safeParse(req.body);
        if (!validate.success) {
            const errors = validate.error.issues.map((item) => ({
                field: item.path[0],
                message: item.message,
            }));
            return res.status(400).json({ success: false, errors });
        }

        const user_id = (req.user as any)?.id;
        const order_id = generateOrderId();
        const { totalPrice, promotion_id, address, note, phone, name } =
            req.body;

        // Lưu session để sử dụng khi return_url
        (req.session as any).paymentData = {
            payment_method: "vnpay",
            order_type: "DELIVERY",
            order_id,
            user_id,
            promotion_id: promotion_id || "",
            totalPrice,
            receiver_name: name,
            receiver_phone: phone,
            delivery_address: address,
            note: note || "",
        };

        const result = await promotionService.applyPromotionByClient(
            +user_id,
            +totalPrice,
            promotion_id || ""
        );

        const totalAmount = result.totalAfterDiscount || totalPrice;
        console.log(totalAmount);
        const url = await PaymentService.createPaymentUrl(totalAmount);
        return res.status(201).json({ url });
    }

    // Bước 2: Xử lý return_url VNPay
    async paymentReturn(req: Request, res: Response) {
        try {
            console.log("hi");
            console.log("VNPay query:", req.query);
            const result = await PaymentService.verifyIpnRequest(req);
            console.log("Verification result:", result);
            switch (result.status) {
                case "fail_checksum":
                    return res.json(IpnFailChecksum);

                case "order_not_found":
                    return res.json(IpnOrderNotFound);

                case "invalid_amount":
                    return res.json(IpnInvalidAmount);

                case "already_confirmed":
                    return res.json(InpOrderAlreadyConfirmed);

                case "success": {
                    const paymentData = (req.session as any).paymentData;
                    if (!paymentData)
                        return res.status(400).send("Session expired");
                    console.log("hiiiii", paymentData);
                    const order = await orderService.createOrderByClient(
                        paymentData
                    );
                    const user = await userService.getDetailCustomerById(
                        +(req.user as any)?.id || 0
                    );
                    console.log("Created order:", order);
                    delete (req.session as any).paymentData;
                    return res.render("client/success/success.ejs", {
                        order,
                        user,
                    });
                }

                default:
                    return res.json(IpnUnknownError);
            }
        } catch (error) {
            console.error("VNPay Return error:", error);
            return res.json(IpnUnknownError);
        }
    }
}

export default new PaymentController();
