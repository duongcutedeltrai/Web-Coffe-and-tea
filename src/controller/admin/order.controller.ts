import { Request, Response } from "express";
import OrderService from "../../services/admin/order.service";

class OrderController {
  async getOrdersPage(req: Request, res: Response) {
    return res.render("admin/orders/orders.ejs");
  }

  async getOrdersData(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const type = req.query.type as string | undefined;
      const search = req.query.search as string | undefined;
      const orders = await OrderService.getAllOrders(status, type, search);
      return res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error getting orders data:", error);
      return res.status(500).json({
        success: false,
        message: "Không thể lấy dữ liệu đơn hàng",
      });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const data = req.body;

      console.log("Received order data:", data);
      // Validate dữ liệu cơ bản
      if (
        !data.receiver_name ||
        !data.receiver_phone ||
        !Array.isArray(data.products)
      ) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu đơn hàng không hợp lệ",
        });
      }

      const newOrder = await OrderService.createOrder(data);
      return res.json({
        success: true,
        message: "Tạo đơn hàng thành công",
        data: newOrder,
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Không thể tạo đơn hàng",
      });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const orderId = req.params.id;

      const order = await OrderService.getOrderById(orderId);
      return res.json({ success: true, data: order });
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Không thể lấy thông tin đơn hàng",
      });
    }
  }

  async getOrdersByStatus(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const orders = await OrderService.getAllOrders(status);
      return res.json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Không thể lấy thông tin đơn hàng",
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Thiếu trạng thái đơn hàng mới",
        });
      }

      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        status
      );
      return res.json({ success: true, data: updatedOrder });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Không thể cập nhật trạng thái đơn hàng",
      });
    }
  }
}

export default new OrderController();
