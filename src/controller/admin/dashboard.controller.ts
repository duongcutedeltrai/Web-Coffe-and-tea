//controller cua admin
import { Request, Response } from "express";

const getDetailProductPage = async (req: Request, res: Response) => {
    return res.render("admin/product/detail_product.ejs");
};
const getProductsPage = async (req: Request, res: Response) => {
    return res.render("admin/product/products.ejs");
};

export { getDetailProductPage, getProductsPage };
