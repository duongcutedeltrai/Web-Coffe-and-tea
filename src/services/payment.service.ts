import crypto from "crypto";
import url from "url";
import { Request } from "express";
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";

const VNP_TMN_CODE = process.env.VNP_TMN_CODE || "FNNTUTKB";
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || "BOHIQ2LHEQSXXCVXKQ2IPFMWLLB0H68S";
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || "http://localhost:3000/api/payment/vnpay/return";
const VNP_HOST = process.env.VNP_HOST || "https://sandbox.vnpayment.vn/";

interface VnpVerifyResult {
    isVerified: boolean;
    isSuccess: boolean;
    vnp_ResponseCode: string;
    [key: string]: any;
}

// ✅ Xác minh chữ ký VNPay (checksum)
export function verifyIpnCall(req: Request): VnpVerifyResult {
    const queryRaw = url.parse(req.originalUrl).query;
    const params: Record<string, string> = {};

    queryRaw?.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        params[key] = value;
    });

    const vnp_SecureHash = params["vnp_SecureHash"];
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map(k => `${k}=${params[k]}`).join("&");

    const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("===== VNPay Checksum Debug =====");
    console.log("SignData:", signData);
    console.log("Generated hash:", signed);
    console.log("VNPay hash:", vnp_SecureHash);
    console.log("Hash match:", vnp_SecureHash === signed);

    const isVerified = vnp_SecureHash === signed;
    const isSuccess = params["vnp_ResponseCode"] === "00";

    return { isVerified, isSuccess, ...params } as VnpVerifyResult;
}

export const PaymentService = {
    // Tạo URL thanh toán VNPay
    async createPaymentUrl(totalAmount: number) {
        const vnpay = new VNPay({
            tmnCode: VNP_TMN_CODE,
            secureSecret: VNP_HASH_SECRET,
            vnpayHost: VNP_HOST,
            testMode: true,
            hashAlgorithm: "SHA512" as any,
            loggerFn: ignoreLogger,
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: totalAmount, // VNPay tính theo đồng
            vnp_IpAddr: "127.0.0.1",
            vnp_TxnRef: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            vnp_OrderInfo: "Thanh toán đơn hàng tại Phê La Coffee Tea",
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: VNP_RETURN_URL,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        });

        return vnpayResponse;
    },

    // Xác minh IPN từ VNPay
    async verifyIpnRequest(req: Request) {
        const verify = verifyIpnCall(req);

        if (!verify.isVerified) {
            return { status: "fail_checksum", message: "Sai chữ ký bảo mật" };
        }

        if (!verify.isSuccess) {
            switch (verify.vnp_ResponseCode) {
                case "07": return { status: "error", message: "Giao dịch nghi ngờ gian lận" };
                case "09": return { status: "error", message: "Thẻ/Tài khoản chưa đăng ký InternetBanking" };
                case "10": return { status: "error", message: "Xác thực OTP thất bại" };
                case "11": return { status: "error", message: "Hết hạn thanh toán" };
                case "12": return { status: "error", message: "Tài khoản không đủ số dư" };
                case "24": return { status: "cancelled", message: "Người dùng hủy giao dịch" };
                default: return { status: "unknown_error", message: `VNPay lỗi: ${verify.vnp_ResponseCode}` };
            }
        }

        return { status: "success", message: "Thanh toán thành công", data: verify };
    }
};
