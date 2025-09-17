
import { prisma } from "../config/client"
import { ACCOUNT_TYPE, STATUS_USER } from "../config/constant";

const initDatabase = async () => {
    const countUser = await prisma.users.count();
    const countRole = await prisma.roles.count();
    const countOrder = await prisma.orders.count();
    const countProduct = await prisma.products.count();
    const countOrderDetail = await prisma.order_details.count();
    const countPointHistory = await prisma.point_history.count();
    const countStaffDetail = await prisma.staff_detail.count();

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

        const staffRole = await prisma.roles.findFirst({
            where: {
                name: "STAFF"
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
                        point: 40,
                        gender: "nam"
                    },
                ]
            })
        }

        if (staffRole) {
            await prisma.users.createMany({
                data: [
                    {
                        email: "staff1@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },
                    {
                        email: "staf2f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "staf24f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "staf32f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "staf2323f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "sta2323ff@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "sta23232ff@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "staf23232f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
                    },

                    {
                        email: "staf32323232f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam"
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
                    },

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

    if (countProduct == 0) {
        await prisma.products.createMany({
            data: [
                {
                    name: "Cà phê đen đá",
                    description: "(Có sẵn Thạch) Vị chua nhẹ tự nhiên của hạt Arabica Lạc Dương & Robusta Lâm Hà, hoà quyện cùng Vani Tự Nhiên, Thạch Xỉu Vani mềm mượt và Sữa Tươi Thanh Trùng đem đến hương vị đậm mượt đầy tinh tế.",
                    sold: 12,
                    quantity: 40
                }
            ]
        })
    }

    if (countOrderDetail == 0) {
        const product = await prisma.products.findFirst({
            where: {
                name: "Cà phê đen đá"
            }
        })
        const order = await prisma.orders.findFirst()

        if (product && order) {
            await prisma.order_details.createMany({
                data: [
                    {
                        order_id: order.order_id,
                        product_id: product.product_id,
                        quantity: 4,
                        price: 12000
                    }
                ]
            })
        }
    }

    if (countPointHistory == 0) {
        const user = await prisma.users.findFirst({
            where: {
                email: "duonghaitt311@gmail.com"
            }
        });

        if (user) {
            await prisma.point_history.createMany({
                data: [
                    {
                        user_id: user.user_id,
                        change: 20,

                    }
                ]
            }
            )
        }
    }

    if (countStaffDetail == 0) {
        const user = await prisma.users.findFirst({
            where: {
                email: "staff1@gmail.com"
            }
        })

        if (user) {
            await prisma.staff_detail.createMany({
                data: {
                    user_id: user.user_id,
                    position: "Pha chế",
                    salary: 5000000,
                    shift: "Ca sáng",
                }
            });
        }
    }


    if (countRole !== 0 && countUser !== 0 && countProduct !== 0 && countOrderDetail !== 0 && countStaffDetail !== 0 && countPointHistory !== 0) {
        console.log(">>>>>>ALEREADY INIT DATA")
    }
}

export default initDatabase;