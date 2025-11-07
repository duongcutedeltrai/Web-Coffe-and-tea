import qs from "qs";
import crypto from "crypto";

const VNP_TMN_CODE = "YOUR_TMN_CODE";
const VNP_HASH_SECRET = "YOUR_HASH_SECRET";
const VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_RETURN_URL = "http://localhost:3000/payment-return";

export const PaymentService = {
    createPaymentUrl(order) {
        const date = new Date();
        const createDate = date
            .toISOString()
            .replace(/[-T:.Z]/g, "")
            .slice(0, 14);
        const orderId = order.id;

        const amount = order.total_amount * 100; // VNPay tính theo đồng
        const ipAddr = "127.0.0.1";

        const vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: VNP_TMN_CODE,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
            vnp_OrderType: "other",
            vnp_Amount: amount,
            vnp_ReturnUrl: VNP_RETURN_URL,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        // Sắp xếp tham số theo thứ tự a-z
        const sorted = Object.fromEntries(Object.entries(vnp_Params).sort());
        const signData = qs.stringify(sorted, { encode: false });
        const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
        const secureHash = hmac
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        sorted["vnp_SecureHash"] = secureHash;
        const paymentUrl = `${VNP_URL}?${qs.stringify(sorted, {
            encode: false,
        })}`;
        return paymentUrl;
    },
};
