import "express-session";

declare module "express-session" {
  interface SessionData {
    paymentData?: {
      order_id:string,
      user_id:string;
      promotion_id: string;
      totalPrice: number;
      receiver_name: string;
      receiver_phone: string;
      delivery_address: string;
      note?: string;
      order_type:"DELIVERY";
      payment_method: "vnpay"
    };
  }
}
