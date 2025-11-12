import { Request, Response } from "express";

import AdminStatisticService from "../../services/statistcs.service";
import productsService from "../../services/products.service";

class AdminStatisticsController {
    getStatisticsPage = async (req: Request, res: Response) => {
        const period = req.query.period as string;
        const data = await AdminStatisticService.getStatisticPage(period);
        for (const product of data.productDetail) {
            const productId = product.product_id;
            console.log(productId);

        }
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

    getStatisticsDetailProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const product = await productsService.getDetailProductsById(+id);

        return res.render("admin/products/detail_product.ejs", {
            product: product,
        });
    };
}

export default new AdminStatisticsController();
