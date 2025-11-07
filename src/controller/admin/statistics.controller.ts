import { Request, Response } from "express";

import AdminStatisticService from "../../services/statistcs.service";

class AdminStatisticsController {
    getStatisticsPage = async (req: Request, res: Response) => {
        const period = req.query.period as string;
        const data = await AdminStatisticService.getStatisticPage(period);
        return res.render("admin/statistics/view_statistics.ejs", {

            data: data,
        });
    };

    getStatistics = async (req: Request, res: Response) => {
        try {
            const period = req.query.period as string;
            const data = await AdminStatisticService.getStatisticPage(period);
            return res.json(data);
        } catch (err) {
            console.log(err);

            return res.status(500).send("Loi khi lay thon ke");
        }
    };
}

export default new AdminStatisticsController();
