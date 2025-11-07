import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ChatService {
    getUserRoomsService = async (userId: number) => {
        return await prisma.room.findMany({
            where: {
                userRooms: {
                    some: { userId },
                },
            },
            include: {
                userRooms: {
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                messages: {
                    take: 1, // lấy tin nhắn cuối cùng để hiển thị preview
                    orderBy: { createdAt: "desc" },
                    include: {
                        sender: {
                            select: {
                                user_id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
    };

    /**
     * Lấy danh sách tin nhắn trong 1 phòng chat
     */
    getMessagesByRoomService = async (roomId: number) => {
        return await prisma.message.findMany({
            where: { roomId },
            include: {
                sender: {
                    select: { user_id: true, username: true, avatar: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });
    };

    /**
     * Tạo phòng chat mới giữa 2 người (nếu chưa có)
     */
    createPrivateRoomService = async (userId1: number, userId2: number) => {
        // Kiểm tra phòng đã tồn tại chưa
        const existingRoom = await prisma.room.findFirst({
            where: {
                isPrivate: true,
                userRooms: {
                    every: {
                        userId: { in: [userId1, userId2] },
                    },
                },
            },
        });

        if (existingRoom) return existingRoom;

        // Nếu chưa có → tạo mới
        const newRoom = await prisma.room.create({
            data: {
                isPrivate: true,
                userRooms: {
                    create: [{ userId: userId1 }, { userId: userId2 }],
                },
            },
            include: {
                userRooms: {
                    include: { user: true },
                },
            },
        });

        return newRoom;
    };

    /**
     * Tạo tin nhắn mới trong phòng
     */
    createMessageService = async (
        roomId: number,
        senderId: number,
        content: string
    ) => {
        return await prisma.message.create({
            data: {
                roomId,
                senderId,
                content,
            },
            include: {
                sender: {
                    select: { user_id: true, username: true, avatar: true },
                },
            },
        });
    };
}
export default new ChatService();
