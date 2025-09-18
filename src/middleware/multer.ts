import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const fileUploadProductMiddleware = (
    fieldName: string,
    dir: string = "images/products"
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
export {
    fileUploadProductMiddleware,
    fileUploadCategoriesMiddleware,
    fileUploadUserMiddleware,
};
