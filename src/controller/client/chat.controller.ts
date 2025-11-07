import { Request, Response } from "express";
import ChatService from "../../services/chat.service";
/**
 * GET /api/chat/rooms
 * → Lấy danh sách các cuộc hội thoại của user hiện tại
 */
class chatController {
    getUserRooms = async (req: Request, res: Response) => {
        try {
            const userId = (req.user as any)?.id;
            if (!userId) return res.status(401).json({ message: "ê" });

            const rooms = await ChatService.getUserRoomsService(userId);
            res.json(rooms);
        } catch (error) {
            console.error("getUserRooms error:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };

    /**
     * GET /api/chat/messages/:roomId
     * → Lấy tất cả tin nhắn trong 1 phòng
     */
    getMessagesByRoom = async (req: Request, res: Response) => {
        try {
            const { roomId } = req.params;
            const messages = await ChatService.getMessagesByRoomService(
                Number(roomId)
            );
            res.json(messages);
        } catch (error) {
            console.error("getMessagesByRoom error:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };

    /**
     * POST /api/chat/room
     * → Tạo phòng chat riêng giữa 2 user
     */
    createPrivateRoom = async (req: Request, res: Response) => {
        try {
            const userId1 = (req.user as any)?.id;
            const { partnerId } = req.body;
            if (!userId1 || !partnerId)
                return res
                    .status(400)
                    .json({ message: "Thiếu thông tin người dùng" });

            const room = await ChatService.createPrivateRoomService(
                userId1,
                Number(partnerId)
            );
            res.json(room);
        } catch (error) {
            console.error("createPrivateRoom error:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };

    /**
     * POST /api/chat/messages
     * → Tạo tin nhắn mới (có thể gọi qua API nếu không dùng socket)
     */
    createMessage = async (req: Request, res: Response) => {
        try {
            const senderId = (req.user as any)?.id;
            const { roomId, content } = req.body;
            if (!senderId || !roomId || !content)
                return res.status(400).json({ message: "Thiếu dữ liệu" });

            const message = await ChatService.createMessageService(
                Number(roomId),
                senderId,
                content
            );
            res.json(message);
        } catch (error) {
            console.error("createMessage error:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };
}
export default new chatController();
