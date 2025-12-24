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

  updateCustomerProfile = async (
    id: number,
    name: string,
    phone: string,
    address: string
  ) => {
    return await prisma.users.update({
      where: {
        user_id: id,
      },
      data: {
        username: name,
        phone: phone,
        address: address,
      },
    });
  };

  updateCustomerAvatar = async (id: number, avatarUrl: string) => {
    return await prisma.users.update({
      where: {
        user_id: id,
      },
      data: {
        avatar: avatarUrl,
      },
    });
  };
}
export default new ClientService();
