import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cookie from "cookie"; // ✅ dùng thư viện parse cookie chính xác hơn

const prisma = new PrismaClient();

export const setupSocket = (io) => {
    // ✅ Middleware xác thực trước khi cho socket kết nối
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            if (!cookieHeader) {
                console.warn("⚠️ No cookie in socket handshake");
                return next(new Error("NO_COOKIE"));
            }

            const cookies = Object.fromEntries(
                cookieHeader.split(";").map((c) => c.trim().split("="))
            );

            const token = cookies.token;
            if (!token) return next(new Error("NO_TOKEN"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            console.error("❌ Socket auth error:", err.message);
            next(new Error("INVALID_TOKEN"));
        }
    });

    // ✅ Sau khi xác thực thành công
    io.on("connection", async (socket) => {
        const user = await prisma.users.findUnique({
            where: { user_id: socket.userId },
            select: { user_id: true, username: true, avatar: true },
        });
        if (!user) {
            console.warn(`⚠️ User ${socket.userId} không tồn tại`);
            socket.disconnect();
            return;
        }
        socket.emit("me", user);
        console.log(`✅ User connected: ${socket.userId}`);
        socket.join(`user_${socket.userId}`); // room cá nhân

        // 🔹 Tham gia room cụ thể
        socket.on("joinRoom", async (roomId, ack) => {
            try {
                const isMember = await prisma.userRoom.findFirst({
                    where: {
                        roomId: Number(roomId),
                        userId: socket.userId,
                    },
                });

                if (!isMember) {
                    if (ack) ack({ ok: false, error: "NOT_MEMBER" });
                    return;
                }

                socket.join(`room_${roomId}`);
                if (ack) ack({ ok: true });
                console.log(`👥 User ${socket.userId} joined room_${roomId}`);
            } catch (error) {
                console.error("joinRoom error:", error.message);
                if (ack) ack({ ok: false, error: "SERVER_ERROR" });
            }
        });

        // 🔹 Gửi tin nhắn trong room
        socket.on("sendMessage", async (data, ack) => {
            try {
                const { roomId, content } = data;

                const isMember = await prisma.userRoom.findFirst({
                    where: {
                        roomId: Number(roomId),
                        userId: socket.userId,
                    },
                });

                if (!isMember) {
                    if (ack) ack({ ok: false, error: "NOT_MEMBER" });
                    return;
                }

                // ✅ Lưu vào DB
                const message = await prisma.message.create({
                    data: {
                        roomId: Number(roomId),
                        senderId: socket.userId,
                        content,
                    },
                    include: { sender: true },
                });

                // ✅ Gửi lại cho tất cả thành viên room
                io.to(`room_${roomId}`).emit("newMessage", message);

                if (ack) ack({ ok: true, message });
            } catch (error) {
                console.error("sendMessage error:", error.message);
                if (ack) ack({ ok: false, error: "SERVER_ERROR" });
            }
        });
        socket.on("typing", ({ roomId }) => {
            if (!roomId) return;
            socket
                .to(`room_${roomId}`)
                .emit("userTyping", { userId: socket.userId });
        });

        socket.on("stopTyping", ({ roomId }) => {
            if (!roomId) return;
            socket
                .to(`room_${roomId}`)
                .emit("userStopTyping", { userId: socket.userId });
        });

        // 🔹 Khi ngắt kết nối
        socket.on("disconnect", (reason) => {
            console.log(`❌ User ${socket.userId} disconnected: ${reason}`);
        });
    });
};
