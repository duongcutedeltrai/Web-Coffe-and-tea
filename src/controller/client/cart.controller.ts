import { product_size } from "@prisma/client";
import cartService from "../../services/cart.service";
import { Request, Response } from "express";
import productsService from "services/products.service";
class CartController {
    getCartAPI = async (req: Request, res: Response) => {
        const userId = (req.user as any)?.id; // Lấy user_id từ req.user +(req.user as any)?.id
        if (!userId) {
            return res.redirect("/auth/login");
        }
        const cart = await cartService.getCartByUserId(+userId);
        res.json({ success: true, cart: cart });
    };
    addProductToCartAPI = async (req: Request, res: Response) => {
        try {
            // console.log("Request body:", req.body);
            const { productId, quantity, size } = req.body;
            const userId = (req.user as any)?.id; // Lấy user_id từ req.user +(req.user as any)?.id
            const role = (req.user as any)?.role;
            console.log("User ID:", userId);
            if (userId && role === 3) {
                const cart = await cartService.createOrUpdateCart(
                    +userId,
                    +productId,
                    +quantity,
                    size as product_size
                );
                // console.log(cart);
                res.json("success");
            } else {
                console.log("User not authenticated or not a customer");
                return res.status(401).json({
                    success: false,
                    message: "unauthorized",
                    redirect: "/auth/login",
                });
            }
        } catch (error) {
            console.error("Error in addProductToCartAPI:", error);
        }
    };
    updateCartAPI = async (req: Request, res: Response) => {
        try {
            const { id_product, quantity, size } = req.body;
            const cartDetailId = req.params.cartDetailId;
            console.log(cartDetailId, id_product, quantity, size);
            const updatedCart = await cartService.updateCartDetail(
                +cartDetailId,
                +id_product,
                +quantity,
                size
            );
            res.json({ cart: updatedCart });
        } catch (error) {
            console.error("Error in updateCartAPI:", error);
        }
    };

    deleteCartAPI = async (req: Request, res: Response) => {
        try {
            const cartDetailId = req.params.cartDetailId;
            await cartService.deleteCartDetail(+cartDetailId);
            res.json("success");
        } catch (error) {
            console.error("Error in deleteCartAPI:", error);
        }
    };
}
export default new CartController();
