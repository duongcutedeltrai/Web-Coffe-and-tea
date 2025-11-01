import { prisma } from "../config/client";
import { Prisma, product_size } from "@prisma/client";

class CartService {
    async getCartByUserId(userId: number) {
        try {
            const cart = await prisma.cart.findUnique({
                where: { user_id: userId },
            });
            if (cart) {
                const cartDetails = await prisma.cart_details.findMany({
                    where: { cart_id: cart.cart_id },
                    include: {
                        products: {
                            include: {
                                price_product: true,
                            },
                        },
                    },
                });
                return { ...cart, cart_details: cartDetails };
            }
            return [];
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw error;
        }
    }
    async createOrUpdateCart(
        userId: number,
        product_id: number,
        quantity: number,
        size: product_size
    ) {
        try {
            const product = await prisma.products.findUnique({
                where: { product_id: product_id },
                include: {
                    price_product: {
                        where: {
                            size: size,
                        },
                    },
                },
            });
            let cart = await prisma.cart.findUnique({
                where: { user_id: userId }, // cần @unique
                include: { cart_details: true },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: {
                        user_id: userId,
                        total: quantity * product.price_product[0].price,
                        quantity: quantity,
                        cart_details: {
                            create: {
                                product_id: product_id,
                                quantity: quantity,
                                price: product.price_product[0].price,
                                product_size: size,
                            },
                        },
                    },
                    include: { cart_details: true },
                });
                return cart;
            } else {
                await prisma.cart.update({
                    where: { cart_id: cart.cart_id },
                    data: {
                        total: {
                            increment:
                                quantity * product.price_product[0].price,
                        },
                        quantity: {
                            increment: quantity,
                        },
                    },
                });
                const currentCartDetails = await prisma.cart_details.findFirst({
                    where: {
                        product_id: product_id,
                        cart_id: cart?.cart_id,
                        product_size: size,
                    },
                });
                await prisma.cart_details.upsert({
                    where: {
                        cart_detail_id: currentCartDetails?.cart_detail_id ?? 0,
                    },
                    update: {
                        quantity: {
                            increment: quantity,
                        },
                        price: product.price_product[0].price,
                    },
                    create: {
                        cart_id: cart.cart_id,
                        product_id: product_id,
                        quantity: quantity,
                        price: product.price_product[0].price,
                        product_size: size,
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching add cart:", error);
            throw error;
        }
    }
    async updateCartDetail(
        cartDetailId: number,
        productId: number,
        quantity: number,
        newSize: product_size
    ) {
        // console.log(productId, quantity, newSize);
        // Lấy cart_detail hiện tại
        const cartDetail = await prisma.cart_details.findUnique({
            where: { cart_detail_id: cartDetailId },
        });
        if (!cartDetail) throw new Error("Cart detail not found");

        // Lấy giá sản phẩm theo size mới
        const productPrice = await prisma.price_product.findFirst({
            where: { product_id: productId, size: newSize as any },
        });
        if (!productPrice) throw new Error("Invalid product/size");

        // Nếu đổi size
        if (cartDetail.product_size !== newSize) {
            const existing = await prisma.cart_details.findFirst({
                where: {
                    cart_id: cartDetail.cart_id,
                    product_id: productId,
                    product_size: newSize as any,
                },
            });

            if (existing) {
                // Cộng quantity vào record cũ
                await prisma.cart_details.update({
                    where: { cart_detail_id: existing.cart_detail_id },
                    data: {
                        quantity: existing.quantity + quantity,
                        price: productPrice.price,
                    },
                });

                // Xoá record cũ (size cũ)
                await prisma.cart_details.delete({
                    where: { cart_detail_id: cartDetailId },
                });
            } else {
                //Tạo mới
                // Chỉ update record hiện tại thành record size mới
                await prisma.cart_details.update({
                    where: { cart_detail_id: cartDetailId },
                    data: {
                        product_size: newSize as any,
                        quantity: quantity,
                        price: productPrice.price,
                    },
                });
            }
        } else {
            // Chỉ đổi quantity
            await prisma.cart_details.update({
                where: { cart_detail_id: cartDetailId },
                data: {
                    quantity: quantity,
                    price: productPrice.price,
                },
            });
        }

        // Gọi hàm updateCartTotals để tính lại cart
        await this.updateCartTotals(cartDetail.cart_id);
    }
    async deleteCartDetail(cartDetailId: number) {
        const deleted = await prisma.cart_details.delete({
            where: { cart_detail_id: cartDetailId },
        });

        // gọi lại hàm updateCartTotals
        await this.updateCartTotals(deleted.cart_id);
    }
    async updateCartTotals(cartId: number) {
        try {
            const cart = await prisma.cart.findUnique({
                where: { cart_id: cartId },
                include: { cart_details: true },
            });

            if (!cart) throw new Error("Cart không tồn tại");

            const newQuantity = cart.cart_details.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const newTotal = cart.cart_details.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const updatedCart = await prisma.cart.update({
                where: { cart_id: cartId },
                data: {
                    quantity: newQuantity,
                    total: newTotal,
                },
                include: { cart_details: true },
            });

            return updatedCart;
        } catch (error) {
            console.error("Lỗi updateCartTotals:", error);
            throw error;
        }
    }
}

export default new CartService();
