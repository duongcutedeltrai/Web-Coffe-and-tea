import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import chatController from "../../controller/client/chat.controller";
import { ChatbotController } from "../../controller/client/chatbot.controller";
const chatRouteAPI = express.Router();

chatRouteAPI.get("/rooms", authMiddleware, chatController.getUserRooms);
chatRouteAPI.get(
    "/messages/:roomId",
    authMiddleware,
    chatController.getMessagesByRoom
);
chatRouteAPI.post("/room", authMiddleware, chatController.createPrivateRoom);
chatRouteAPI.post("/messages", authMiddleware, chatController.createMessage);
chatRouteAPI.post("/chatbot", ChatbotController.chat);
export default chatRouteAPI;
