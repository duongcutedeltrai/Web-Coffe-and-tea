import multer from "multer";
import path from "path";
import { v4 } from "uuid";
import { Request, Response, NextFunction } from "express";
const fileUploadProductMiddleware = (
    fieldName: string,
    dir: string = "images/products"
) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: "public/" + dir,
            filename: (req, file, cb) => {
                cb(null, v4() + path.extname(file.originalname));
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: Function
        ) => {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(
                    new Error("Chỉ hỗ trợ hình ảnh dạng .png .jpg .jpeg"),
                    false
                );
            }
        },
    }).single(fieldName);
    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (err: any) => {
            if (err) {
                let message = err.message;
                // Kiểm tra lỗi MulterError
                if (err.code === "LIMIT_FILE_SIZE") {
                    message = "File quá lớn, tối đa 5MB";
                }
                return res
                    .status(400)
                    .json({ success: false, message: err.message });
            }
            next();
        });
    };
};
const fileUploadCategoriesMiddleware = (
    fieldName: string,
    dir: string = "images/categories"
) => {
    return multer({
        storage: multer.diskStorage({
            destination: "public/" + dir,
            filename: (req, file, cb) => {
                cb(null, v4() + path.extname(file.originalname));
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: Function
        ) => {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(new Error("Only JPEG and PNG images are allowed."), false);
            }
        },
    }).single(fieldName);
};
const fileUploadUserMiddleware = (
    fieldName: string,
    dir: string = "images/users"
) => {
    return multer({
        storage: multer.diskStorage({
            destination: "public/" + dir,
            filename: (req, file, cb) => {
                const extension = path.extname(file.originalname);
                cb(null, v4() + extension);
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 3, //3mb
        },
        fileFilter: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: Function
        ) => {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(new Error("Only JPEG and PNG images are allowed."), false);
            }
        },
    }).single(fieldName);
};
// Cấu hình nơi lưu file tạm thời
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/feedback"); // Thư mục tạm
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Cấu hình giới hạn và filter
const fileUploadFeedbackMiddleware = () => {
    const upload = multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // ⛔ Giới hạn 5MB
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
            ];
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(
                    new Error("❌ Chỉ cho phép upload ảnh JPG, PNG hoặc WEBP")
                );
            }
            cb(null, true);
        },
    }).array("images", 3);
    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (err: any) => {
            if (err) {
                let message = err.message;
                // Kiểm tra lỗi MulterError
                if (message === "Field value too long") {
                    message = "File quá lớn,cho phép tối đa 10MB";
                }

                return res
                    .status(400)
                    .json({ success: false, message: message });
            }
            next();
        });
    };
};
export {
    fileUploadProductMiddleware,
    fileUploadCategoriesMiddleware,
    fileUploadUserMiddleware,
    fileUploadFeedbackMiddleware,
};
