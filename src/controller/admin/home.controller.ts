import { Request, Response } from "express";

class AdminHomeController {
    getHomeAdminPage = async (req: Request, res: Response) => {
        return res.render("admin/dashboard/dashboard.ejs");
    };
}

export default new AdminHomeController();
