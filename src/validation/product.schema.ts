//validate du lieu
import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string().trim().min(1, { message: "Tên phải có ít nhất 2 ký tự" }),
    description: z.string(),
    prices: z
        .object({
            M: z
                .string()
                .transform((val) => Number(String(val).replace(/[^\d]/g, "")))
                .refine((num) => num > 1000, {
                    message: "Số tiền của sản phẩm tối thiểu là 1.000đ",
                }),
            L: z
                .string()
                .transform((val) => Number(String(val).replace(/[^\d]/g, "")))
                .refine((num) => num > 1000, {
                    message: "Số tiền của sản phẩm tối thiểu là 1.000đ",
                }),
            XL: z
                .string()
                .transform((val) => Number(String(val).replace(/[^\d]/g, "")))
                .refine((num) => num > 1000, {
                    message: "Số tiền của sản phẩm tối thiểu là 1.000đ",
                }),
        })
        .superRefine((val, ctx) => {
            if (val.L <= val.M) {
                ctx.addIssue({
                    code: "custom",
                    message: "Giá size L phải lớn hơn size M",
                    path: ["L"], // báo lỗi ở field L
                });
            }
            if (val.XL <= val.L) {
                ctx.addIssue({
                    code: "custom",
                    message: "Giá size XL phải lớn hơn size L",
                    path: ["XL"], // báo lỗi ở field XL
                });
            }
        }),
    status: z.enum(["selling", "soldout", "hidden"]),
    category: z.string().trim().min(1),
    quantity: z.coerce.number().min(-1),
});

export type TProductSchema = z.infer<typeof ProductSchema>;
