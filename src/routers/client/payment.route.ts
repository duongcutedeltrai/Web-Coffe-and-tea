import { Router } from "express";
import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import paymentController from "../../controller/client/payment.controller";
const paymentAPI = express.Router();

paymentAPI.post(
    "/vnpay/create_payment",
    authMiddleware,
    paymentController.createPayment
);
paymentAPI.get(
    "/vnpay/return",
    authMiddleware,
    paymentController.paymentReturn
);

export { paymentAPI };
