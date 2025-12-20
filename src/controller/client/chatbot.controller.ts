import { Request, Response } from "express";
import { ChatbotService } from "../../services/chatbot.service";


const sessionHistory: Record<string, any[]> = {};

export class ChatbotController {
  static async chat(req: Request, res: Response) {
    try {
        
      const message = req.body.message || "";
      const sessionId = req.body.sessionId || "default";

      // Lưu lịch sử chat
      sessionHistory[sessionId] = sessionHistory[sessionId] || [];
      sessionHistory[sessionId].push({ role: "user", text: message });

      // Lấy dữ liệu DB
      const menu = await ChatbotService.formatProducts();
      const promo = await ChatbotService.formatPromotions();
 
      const history = sessionHistory[sessionId]
        .slice(-6)
        .map(
          (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`
        )
        .join("\n");

      const prompt = `
Bạn là chatbot thân thiện của quán Phê La Coffee And Tea.

MENU:
${menu}

KHUYẾN MÃI:
${promo}

Lịch sử:
${history}

User: ${message}
Trả lời thân thiện:
`;

      const reply = await ChatbotService.callOpenRouter(prompt);
console.log("=== ChatbotController.chat called ===");
    console.log("Request body:", prompt);
      sessionHistory[sessionId].push({ role: "assistant", text: reply });

      res.json({ reply });
      console.log("Message:", message);
console.log("Session ID:", sessionId);
console.log("Menu:", menu);
console.log("Promo:", promo);
console.log("Prompt:", prompt);

    } catch (err: any) {
      res.status(500).json({
        reply: "Xin lỗi, có lỗi xảy ra!",
        error: err.message,
      });
    }
  }
}
