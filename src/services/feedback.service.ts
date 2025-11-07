import {
    TOTAL_ITEMS_PER_PAGE,
    TOTAL_ITEMS_PER_PAGE_CLIENT,
} from "../config/constant";
import { prisma } from "../config/client";
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import fs from "fs";

class FeedbackService {
    createFeedback = async (
        user_id: number,
        product_id: number,
        rating: number,
        comment: string,
        files: Express.Multer.File[]
    ) => {
        const hasOrder = await prisma.order_details.findFirst({
            where: { product_id: product_id, orders: { user_id: user_id } },
        });
        if (!hasOrder)
            throw new Error(
                "Bạn chưa mua sản phẩm này nên không thể đánh giá được"
            );
        const alreadyReviewed = await prisma.feedback.findFirst({
            where: {
                user_id: user_id,
                product_id: product_id,
            },
        });
        if (alreadyReviewed)
            throw new Error("Bạn đã đáng giá sản phẩm này rồi");

        const urls: string[] = [];

        for (const file of files || []) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "feedbacks",
            });
            urls.push(result.secure_url);
            fs.unlinkSync(file.path); 
        }
        const feedback = await prisma.feedback.create({
            data: {
                user_id,
                product_id,
                rating,
                comment,
                images: JSON.stringify(urls),
            },
        });
        const avg = await prisma.feedback.aggregate({
            where: { product_id },
            _avg: { rating: true },
        });
        await prisma.products.update({
            where: { product_id },
            data: { average_rating: avg._avg.rating ?? 0 },
        });
        await prisma.users.update({
            where: { user_id },
            data: {
                point: { increment: 5 },
            },
        });
        return feedback;
    };
    getFeedbackByIdProduct = async (product_id: number) => {
        const feedbacks = await prisma.feedback.findMany({
            where: {
                product_id: product_id,
            },
            include: {
                users: true,
            },
            orderBy: { created_at: "desc" },
        });
        return feedbacks;
    };
}
export default new FeedbackService();
