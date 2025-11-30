import express from "express";
import webRouter from "./routers/web";
// import getConection from "./config/database";
import { initDatabase } from "./config/seed";
import { z } from "zod";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { setupSocket } from "./socket";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
//config view enginee
app.use(session({
  secret: "vnpay-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,       // true nếu dùng HTTPS
    maxAge: 1000 * 60 * 15  // 15 phút
  }
}));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//static files
app.use(express.static("public"));



//config routers
webRouter(app);
// getConection();

initDatabase();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // hoặc http://localhost:5173 nếu FE chạy riêng
        credentials: true,
    },
});
setupSocket(io);
server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});