import { Request, Response } from "express";
import feedbackService from "../../services/feedback.service";

class FeedbackController {
    postFeedback = async (req: Request, res: Response) => {
        try {
            const user_id = (req.user as any)?.id;
            console.log("hi");
            const { product_id, rating, comment } = req.body;

            const files = req.files as Express.Multer.File[];
            console.log(files);
            if (!user_id)
                return res.status(401).json({
                    message: "Vui lòng đăng nhập trước khi đánh giá.",
                });
            if (!rating)
                return res.status(400).json({
                    message: "Vui lòng đánh giá sao trước khi feedback",
                });

            const feedback = await feedbackService.createFeedback(
                +user_id,
                +product_id,
                +rating,
                comment,
                files
            );
            console.log(feedback);
            return res.status(201).json({
                message: "Đánh giá thành công",
                data: feedback,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };
    getFeedback = async (req: Request, res: Response) => {
        const product_id = req.body.product_id;
        const feedbacks = await feedbackService.getFeedbackByIdProduct(
            +product_id
        );
        return res.status(201).json({ data: feedbacks });
    };
}

export default new FeedbackController();
