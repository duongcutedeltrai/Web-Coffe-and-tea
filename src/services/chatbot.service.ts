import axios from "axios";
import productsService from "./products.service";
import promotionService from "./promotion.service";


export class ChatbotService {
  static async formatProducts() {
  const items = await productsService.getAllProducts();

  if (!items.length) return "Sản phẩm hiện chưa có món nào.";

  return items
    .map((i: any) => {
      const prices = i.price_product
        .map((p: any) => `${p.size}: ${p.price}đ`)
        .join(", ");

      const category = i.categories?.name ? ` [${i.categories.name}]` : "";

      return `- ${i.name}${category} – ${prices}${i.description ? " – " + i.description : ""}`;
    })
    .join("\n");
}
  static async formatPromotions() {
    const promos = await promotionService.getAllPromotionsVoucher();

    if (!promos.length) return "Hiện không có khuyến mãi.";

    return promos.map((p: any) => `• ${p.title}: ${p.detail}`).join("\n");
  }

  static async callOpenRouter(prompt: string) {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY");
      return "Lỗi cấu hình API.";
    }

    const model =  "mistralai/mistral-7b-instruct:free";  
    // model example: nhiều model Free có dạng `<model-id>:free`
    console.log("Using OpenRouter model:", model);

    try {
      const resp = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: [
            { role: "user", content: prompt }
          ],
          max_tokens: 556,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Response theo chuẩn OpenAI / OpenRouter
      const data = resp.data;
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      } else if (data.choices && data.choices[0]?.text) {
        return data.choices[0].text;
      }

      return JSON.stringify(data);
    } catch (err: any) {
      console.error("Error calling OpenRouter API:", err.response?.data || err.message);
      return "Có lỗi khi gọi OpenRouter API.";
    }
  }
}
