//controller cua admin
import { Request, Response } from "express";

const getDetailProductPage = async (req: Request, res: Response) => {
    return res.render("admin/detail_product.ejs");
};
const getProductsPage = async (req: Request, res: Response) => {
    return res.render("admin/products");
};

export { getDetailProductPage, getProductsPage };
