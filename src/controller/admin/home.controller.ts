import { Request, Response } from "express";

class AdminHomeController {
    getHomeAdminPage = async (req: Request, res: Response) => {
        return res.render("admin/home/home.ejs");
    };
}

export default new AdminHomeController();
