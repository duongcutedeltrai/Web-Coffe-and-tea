//validate du lieu
import { z } from "zod";

export const ProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, { message: "Tên phải có ít nhất 1 ký tự" }),
        desc: z.string(), // <- đổi từ description thành desc
        sizeM: z.coerce.number().min(0), // cho phép 0 nếu không nhập
        sizeL: z.coerce.number().min(0),
        sizeXL: z.coerce.number().min(0),
        defaultPrice: z.coerce.number().min(0),
        status: z.enum(["DANG_BAN", "HET", "TAM_AN"]),
        category: z.coerce.number().min(1),
        quantity: z.coerce.number().min(-1),
    })
    .superRefine((val, ctx) => {
        const hasDefault = val.defaultPrice > 0;
        const hasSizes = val.sizeM > 0 || val.sizeL > 0 || val.sizeXL > 0;
        if (hasDefault && hasSizes) {
            ctx.addIssue({
                code: "custom",
                message: "Nếu có giá cố định thì không được nhập giá theo size",
                path: ["defaultPrice"],
            });
        }
        if (!hasDefault && !hasSizes) {
            ctx.addIssue({
                code: "custom",
                message: "Phải có ít nhất một giá cho sản phẩm",
                path: ["sizeM"],
            });
        }
        if (!hasDefault) {
            if (val.sizeL > 0 && val.sizeL <= val.sizeM) {
                ctx.addIssue({
                    code: "custom",
                    message: "Giá size L phải lớn hơn size M",
                    path: ["sizeL"],
                });
            }
            if (val.sizeXL > 0 && val.sizeXL <= val.sizeL) {
                ctx.addIssue({
                    code: "custom",
                    message: "Giá size XL phải lớn hơn size L",
                    path: ["sizeXL"],
                });
            } else if (val.sizeXL > 0 && val.sizeXL <= val.sizeM) {
                ctx.addIssue({
                    code: "custom",
                    message: "Giá size XL phải lớn hơn size M",
                    path: ["sizeXL"],
                });
            }
        }
    });

export type TProductSchema = z.infer<typeof ProductSchema>;
