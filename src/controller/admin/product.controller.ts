//controller cua admin
import { Request, Response } from "express";

const getViewDetailProductPage = async (req: Request, res: Response) => {
    return res.render("admin/product/detail.ejs");
};

export { getViewDetailProductPage };
