import express from "express";
import { fileUploadFeedbackMiddleware } from "../../middleware/multer";
import feedbackController from "../../controller/client/feedback.controller";
import {
    authMiddleware,
    roleMiddleware,
} from "../../middleware/auth.middleware";
const feedbackRoute = express.Router();

feedbackRoute.post(
    "/feedback",
    authMiddleware,
    roleMiddleware(1, 2, 3),
    fileUploadFeedbackMiddleware(),
    feedbackController.postFeedback
);
export default feedbackRoute;
