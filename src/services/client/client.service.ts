import { TOTAL_ITEMS_PER_PAGE_CLIENT } from "../../config/constant";
import { prisma } from "../../config/client";
import { Prisma } from "@prisma/client";
class ClientService {
    getDetailCustomerById = async (id: number) => {
        const viewDetail = prisma.users.findUnique({
            where: {
                user_id: id,
            },
            include: {
                orders: {
                    include: {
                        order_details: {
                            include: {
                                products: true,
                            },
                        },
                    },
                },
                point_history: true,
            },
        });
        return viewDetail;
    };
    getProductsSellWell = async () => {
        return await prisma.products.findMany({});
    };

    getAllCategories = async () => {
        return await prisma.categories.findMany();
    };
}
export default new ClientService();
