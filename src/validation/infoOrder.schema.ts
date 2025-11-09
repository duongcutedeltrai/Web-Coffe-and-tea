// infoOrder.schema.ts
import { z } from "zod";

// Schema validate thông tin order
export const InfoOrderSchema = z
    .object({
        name: z.string().trim().min(1, { message: "Tên không được để trống" }),
        phone: z
            .string()
            .trim()
            .min(1, { message: "Số điện thoại không được để trống" })
            .regex(/^0\d{9,10}$/, { message: "Số điện thoại không hợp lệ" }), // bắt đầu bằng 0 và 10-11 chữ số
        address: z
            .string()
            .trim()
            .min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
        email: z
            .string()
            .trim()
            .min(1, { message: "Email không được để trống" })
            .email({ message: "Email không hợp lệ" }),
    })
    .superRefine((val, ctx) => {
        // Logic tùy chỉnh ví dụ: tên phải dài ít nhất 2 ký tự
        if (val.name.length < 2) {
            ctx.addIssue({
                code: "custom",
                message: "Tên phải dài ít nhất 2 ký tự",
                path: ["name"],
            });
        }
    });

// TypeScript type từ schema
export type TInfoOrderSchema = z.infer<typeof InfoOrderSchema>;
