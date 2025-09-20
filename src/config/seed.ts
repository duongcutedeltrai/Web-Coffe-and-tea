
import { product_size } from "@prisma/client";
import { prisma } from "./client";
import { STATUS_USER } from "./constant";
const bcrypt = require("bcrypt");
const saltRounds = 10;

const initDatabase = async () => {
    // const countUser = await prisma.user.count();
    // const countRole = await prisma.role.count();
    const countUser = await prisma.users.count();
    const countRole = await prisma.roles.count();
    const countOrder = await prisma.orders.count();
    const countProduct = await prisma.products.count();
    const countOrderDetail = await prisma.order_details.count();
    const countPointHistory = await prisma.point_history.count();
    const countStaffDetail = await prisma.staff_detail.count();
    const countCaterogies = await prisma.categories.count();

    if (countRole == 0) {
        await prisma.roles.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "ADMIN full quyen",
                },
                {
                    name: "STAFF",
                    description: "Staff Dat mon",
                },

                {
                    name: "CUSTOMER",
                    description: "Customer thong thuong",
                },
            ],
        });

    }

    if (countUser == 0) {
        const customerRole = await prisma.roles.findFirst({
            where: {
                name: "CUSTOMER",
            },
        });

        const staffRole = await prisma.roles.findFirst({
            where: {
                name: "STAFF",
            },
        });


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
                        gender: "nam",
                    },
                ],
            });
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
                        gender: "nam",
                    },
                    {
                        email: "staf2f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "staf24f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "staf32f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "staf2323f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "sta2323ff@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "sta23232ff@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "staf23232f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,
                        gender: "nam",
                    },

                    {
                        email: "staf32323232f@gmail.com",
                        username: "duong",
                        password: "123456",
                        phone: "111111",
                        role_id: staffRole.role_id,

                        gender: "nam",
                    },
                ],
            });
        }
    }

    if (countOrder == 0) {
        const userID = await prisma.users.findFirst({
            where: {

                email: "duonghaitt311@gmail.com",
            },
        });

        if (userID) {
            await prisma.orders.createMany({
                data: [
                    {
                        user_id: userID.user_id,
                        total_amount: 20000000,
                        delivery_address: "acascs",
                        receiver_name: "Pham Anh Duong",

                        receiver_phone: "1111",
                    },

                    {
                        user_id: userID.user_id,
                        total_amount: 20000000,
                        delivery_address: "acascs",
                        receiver_name: "Pham Anh Duong",

                        receiver_phone: "1111",
                    },
                ],
            });
        }
    }

    if (countOrderDetail == 0) {
        const product = await prisma.products.findFirst({
            where: {
                name: "PHÊ XỈU VANI",
            },
        });
        const order = await prisma.orders.findFirst();

        if (product && order) {
            await prisma.order_details.createMany({
                data: [
                    {
                        order_id: order.order_id,
                        product_id: product.product_id,
                        quantity: 4,

                        price: 12000,
                    },
                ],
            });
        }
    }

    if (countPointHistory == 0) {
        const user = await prisma.users.findFirst({
            where: {

                email: "duonghaitt311@gmail.com",
            },
        });

        if (user) {
            await prisma.point_history.createMany({
                data: [
                    {
                        user_id: user.user_id,
                        change: 20,

                    },
                ],
            });
        }
    }

    if (countStaffDetail == 0) {
        const user = await prisma.users.findFirst({
            where: {

                email: "staff1@gmail.com",
            },
        });

        if (user) {
            await prisma.staff_detail.createMany({
                data: {
                    user_id: user.user_id,
                    position: "Pha chế",
                    salary: 5000000,
                    shift: "Ca sáng",

                },
            });
        }
    }

    if (countCaterogies == 0) {
        await prisma.$executeRawUnsafe(
            `ALTER TABLE categories AUTO_INCREMENT = 1`
        );
        const categories = [
            {
                name: "Cà Phê",
                description:
                    "Gồm cà phê đen, nâu, bạc xỉu, espresso, cappuccino, latte và các món pha máy phổ biến.",
            },
            {
                name: "Syphon",
                description:
                    "Cà phê pha thủ công bằng dụng cụ Syphon — hương vị trong trẻo, phù hợp người thích trải nghiệm pha tay.",
            },
            {
                name: "French Press",
                description:
                    "Cà phê pha bằng bình ép kiểu Pháp — đậm đà, giữ trọn hương vị nguyên chất.",
            },
            {
                name: "Moka Pot",
                description:
                    "Cà phê pha bằng bình Moka Pot phong cách Ý — vị mạnh, đầy đặn.",
            },
            {
                name: "Cold Brew",
                description:
                    "Cà phê ủ lạnh nhiều giờ — vị dịu nhẹ, ít đắng, tươi mát, phù hợp đồ uống mùa hè.",
            },
            {
                name: "Ô Long & Matcha",
                description:
                    "Các loại trà ô long, trà nhài, matcha latte và biến tấu trà sữa thanh mát.",
            },
            {
                name: "Topping",
                description:
                    "Lựa chọn thêm: trân châu, thạch, kem tươi, whipping cream, hạt trang trí.",
            },
            {
                name: "Plus - Lon/Chai tiện lợi",
                description:
                    "Đồ uống đóng sẵn trong lon/chai: cold brew, trà trái cây, nước giải khát tiện mang theo.",
            },
            {
                name: "Cà phê hạt rang xay (Gói mang về)",
                description:
                    "Các loại cà phê hạt rang từ Ethiopia, Kenya, Colombia… đóng gói 150g–250g, phù hợp pha phin, máy hoặc pha tay tại nhà.",
            },
            {
                name: "Combo",
                description:
                    "Set combo nhiều ly cà phê/trà, phù hợp cho nhóm, họp mặt hoặc gia đình với giá ưu đãi hơn.",
            },
            {
                name: "Bánh ngọt",
                description:
                    "Bánh tươi phục vụ tại quán: cheesecake, tiramisu, cookie, brownie và các loại pastry.",
            },
            {
                name: "Phụ kiện",
                description:
                    "Các sản phẩm mang thương hiệu, tiện dụng và thời trang: túi tote, ly giữ nhiệt, bình nước… giúp khách hàng đồng hành cùng thương hiệu mọi lúc",
            },
        ];
        await prisma.categories.createMany({
            data: categories,
        });
    }


    if (
        countRole !== 0 &&
        countUser !== 0 &&
        countProduct !== 0 &&
        countOrderDetail !== 0 &&
        countStaffDetail !== 0 &&
        countPointHistory !== 0 &&
        countCaterogies !== 0
    ) {
        console.log(">>> ALREADY INIT DATA...");
    }
};
const hashPassword = async (myPlaintextPassword) => {
    const pass = await bcrypt.hash(myPlaintextPassword, saltRounds);
    return pass;
};

const comparePassword = async (
    myPlaintextPassword: string,
    hashPass: string
) => {
    return await bcrypt.compare(myPlaintextPassword, hashPass);
};

export { initDatabase, hashPassword, comparePassword };
// const myPlaintextPassword = "s0//P4$$w0rD";
