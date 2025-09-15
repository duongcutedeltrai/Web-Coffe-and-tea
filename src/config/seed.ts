
import { prisma } from "../config/client"
import { ACCOUNT_TYPE, STATUS_USER } from "../config/constant";

const initDatabase = async () => {
    const countUser = await prisma.users.count();
    const countRole = await prisma.roles.count();
    const countOrder = await prisma.orders.count();


    if (countRole == 0) {
        await prisma.roles.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "ADMIN full quyen"
                },
                {
                    name: "STAFF",
                    description: "Staff Dat mon"
                },

                {
                    name: "CUSTOMER",
                    description: "Customer thong thuong"
                }
            ]
        })
    }

    if (countUser == 0) {
        const customerRole = await prisma.roles.findFirst({
            where: {
                name: "CUSTOMER"
            }
        })


        if (customerRole) {
            await prisma.users.createMany({
                data: [
                    {
                        email: "duonghaitt311@gmail.com",
                        username: "phamanhduong",
                        password: "123456",
                        phone: "111111",
                        role_id: customerRole.role_id,
                        status: STATUS_USER.ACTIVITY,
                        gender: "nam"
                    },

                    {
                        email: "http@gmail.com",
                        username: "âcsa",
                        password: "123456",
                        phone: "111111",
                        role_id: customerRole.role_id,
                        status: STATUS_USER.ACTIVITY,
                        gender: "nu"
                    },
                ]
            })
        }
    }

    if (countOrder == 0) {
        const userID = await prisma.users.findFirst({
            where: {
                email: "duonghaitt311@gmail.com"
            }
        })

        if (userID) {
            await prisma.orders.createMany({
                data: [
                    {
                        user_id: userID.user_id,
                        total_amount: 20000000,
                        delivery_address: "acascs",
                        receiver_name: "Pham Anh Duong",
                        receiver_phone: "1111"
                    }
                ]
            })
        }
    }

    if (countRole !== 0 && countUser !== 0) {
        console.log(">>>>>>ALEREADY INIT DATA")
    }
}

export default initDatabase;