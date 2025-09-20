import { product_size } from "@prisma/client";
import { prisma } from "./client";
const bcrypt = require("bcrypt");
const saltRounds = 10;

const initDatabase = async () => {
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

                    {
                        email: "duonghaitt3112@gmail.com",
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
                data: [
                    {
                        user_id: user.user_id,
                        position: "Pha chế",
                        salary: 5000000,
                        shift: "Ca sáng",
                    },
                ]
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
    if (countProduct === 0) {
        const products = [
            {
                name: "PHÊ XỈU VANI",
                description:
                    "Một biến tấu tinh tế của cà phê phin truyền thống, hòa quyện vị đắng nhẹ của hạt cà phê cùng vị béo ngậy của sữa đặc. Điểm nhấn vani thanh thoát giúp hương vị trở nên quyến rũ và dễ uống, để lại dư vị ngọt ngào khó quên.",
                price: { M: 40000, L: 53000, XL: 67000 },
                category_id: 1,
                images: "Phê xỉu vani.jpg",
            },
            {
                name: "PHÊ ESPRESSO (Hạt Colom, Ethi)",
                description:
                    "Tinh hoa của hạt Arabica từ những vùng trồng danh tiếng, mang đến một “shot” đậm đặc, vị chua thanh thoát hòa quyện cùng hậu vị ngọt tự nhiên. Đây là lựa chọn hoàn hảo cho những ai muốn thưởng thức sức mạnh nguyên bản của cà phê.",
                price: { M: 40000, L: 53000, XL: 67000 },
                category_id: 1,
                images: "Phê espresso(hạt colom, ethi).jpg",
            },
            {
                name: "PHÊ ESPRESSO (Hạt Ro, Ara)",
                description:
                    "Một ly espresso mạnh mẽ từ sự kết hợp của Robusta và Arabica, mang vị đắng rõ rệt và hương thơm sâu. Dành cho người yêu sự tỉnh táo và quyết đoán.",
                price: { M: 45000, L: 58000, XL: 69000 },
                category_id: 1,
                images: "phê espresso(hạt ro, ara).jpg",
            },
            {
                name: "PHÊ LATTE (Hạt Colom, Ethi)",
                description:
                    "Lớp espresso đậm đà được làm dịu bởi vị ngọt béo của sữa tươi, tạo nên một tổng thể cân bằng, mượt mà và dễ uống. Tách latte là sự lựa chọn lý tưởng cho những ai mới bắt đầu bước vào thế giới cà phê.",
                price: { M: 53000, L: 66000, XL: 79000 },
                category_id: 1,
                images: "Phê latte(hạt colom, ethi).jpg",
            },
            {
                name: "PHÊ LATTE (Hạt Ro, Ara)",
                description:
                    "Espresso từ Robusta và Arabica kết hợp cùng sữa tươi béo mịn, tạo nên hương vị cân bằng. Một lựa chọn thân thiện và dễ thưởng thức mỗi ngày.",
                price: { M: 56000, L: 69000, XL: 83000 },
                category_id: 1,
                images: "Phê latte(hạt ro, ara).jpg",
            },
            {
                name: "PHÊ CAPPU (Hạt Ro, Ara)",
                description:
                    "Lớp bọt sữa dày, mềm mịn ôm trọn hương espresso mạnh mẽ, tạo nên sự đối lập hoàn hảo giữa đắng và béo. Một chút cacao rắc trên bề mặt càng làm hương vị thêm hấp dẫn và đầy quyến rũ.",
                price: { M: 53000, L: 66000, XL: 80000 },
                category_id: 1,
                images: "Phe cappu.jpg",
            },
            {
                name: "PHÊ CAPPU (Hạt Colom, Ethi)",
                description:
                    "Sự kết hợp giữa espresso Colombia/Ethiopia và lớp bọt sữa mịn. Hậu vị đắng ngọt cân bằng, thích hợp cho buổi sáng năng động.",
                price: { M: 56000, L: 69000, XL: 83000 },
                category_id: 1,
                images: "Phe cappu.jpg",
            },
            {
                name: "PHÊ AME (Hạt Ro, Ara)",
                description:
                    "Sự kết hợp của espresso Robusta và Arabica pha loãng bằng nước nóng, mang lại một tách cà phê thanh thoát, dễ uống nhưng vẫn mạnh mẽ.",
                price: { M: 43000, L: 55000, XL: 67000 },
                category_id: 1,
                images: "phê ame(hạt colom, ethi).jpg",
            },
            {
                name: "PHÊ AME (Hạt Colom, Ethi)",
                description:
                    "Americano từ hạt Arabica Ethiopia và Colombia, giữ trọn sự tinh tế nhưng nhẹ nhàng hơn espresso. Lựa chọn hoàn hảo để nhâm nhi lâu.",
                price: { M: 48000, L: 60000, XL: 72000 },
                category_id: 1,
                images: "phê ame(hạt colom, ethi).jpg",
            },
            {
                name: "PHÊ NÂU",
                description:
                    "Ly cà phê sữa quen thuộc, hòa quyện vị đắng đậm đà cùng độ béo ngọt vừa phải. Đây là hương vị “quốc dân”, gần gũi và luôn mang lại cảm giác thân thuộc.",
                price: { M: 35000, L: 48000, XL: 59000 },
                category_id: 1,
                images: "Phê nâu.jpg",
            },
            {
                name: "ĐÀ LẠT",
                description:
                    "Cà phê Arabica Đà Lạt đậm đà hoà quyện cùng kem whipping thơm ngậy.",
                price: { M: 42000, L: 58000, XL: 70000 },
                category_id: 1,
                images: "Đà lạt.jpg",
            },
            {
                name: "PHÊ ĐEN",
                description:
                    "Vị đắng nguyên bản, nồng nàn nhưng không gắt, với hậu vị chua thanh và hương thơm tự nhiên từ hạt Arabica Lạc Dương và Robusta Lâm Hà. Thức uống dành cho những ai yêu sự mạnh mẽ và tinh khiết.",
                price: { M: 32000, L: 45000, XL: 56000 },
                category_id: 1,
                images: "Phê đen.jpg",
            },
            {
                name: "Ô LONG NHÀI SỮA",
                description:
                    "Vị trà Ô Long đặc sản kết hợp cùng hương nhài thanh tao, nhẹ nhàng lan tỏa. Lớp sữa béo ngậy mang đến trải nghiệm hài hòa, vừa tươi mát vừa êm dịu.",
                price: { M: 57000, L: 69000, XL: 80000 },
                category_id: 2,
                images: "Ô long nhài sữa size m.jpg",
            },
            {
                name: "Ô LONG SỮA PHÊ LA",
                description:
                    "Vị trà đậm chất cao nguyên, kết hợp với sữa béo ngậy tạo thành một tổng thể hài hòa. Dù uống nóng hay lạnh, bạn đều cảm nhận rõ sự êm dịu lan tỏa.",
                price: { M: 53000, L: 65000, XL: 73000 },
                category_id: 2,
                images: "Ô long sữa.jpg",
            },
            {
                name: "PHONG LAN (Ô LONG VANI SỮA)",
                description:
                    "Vị trà đậm chất cao nguyên, kết hợp với sữa béo ngậy tạo thành một tổng thể hài hòa. Dù uống nóng hay lạnh, bạn đều cảm nhận rõ sự êm dịu lan tỏa.",
                price: { M: 50000, L: 59000, XL: 69000 },
                category_id: 2,
                images: "Phong lan.jpg",
            },
            {
                name: "LỤA ĐÀO - Phiên bản Đồng Chill yêu thích",
                description:
                    "Hương trà Ô Long dịu nhẹ hòa quyện cùng vị đào ngọt ngào, mang lại cảm giác tươi trẻ, tràn đầy sức sống. Mỗi ngụm như một làn gió mát mùa hè, khiến bạn muốn thưởng thức mãi không dừng.",
                price: { M: 57000, L: 69000, XL: 80000 },
                category_id: 3,
                images: "LỤA ĐÀO - Phiên bản Đồng Chill yêu thích (size La).jpg",
            },
            {
                name: "Trà Vỏ Cà Phê",
                description:
                    "Trà Vỏ Cà Phê - thức uống độc đáo được làm từ vỏ quả cà phê, hương trà thơm nhẹ hòa quyện cùng vị chua dịu của chanh vàng.",
                price: { M: 47000, L: 55000, XL: 65000 },
                category_id: 3,
                images: "TRÀ VỎ CÀ PHÊ.jpg",
            },
            {
                name: "Ô LONG ĐÀO HỒNG",
                description:
                    "Hương trà Ô Long dịu nhẹ hòa quyện cùng vị đào ngọt ngào, mang lại cảm giác tươi trẻ, tràn đầy sức sống. Mỗi ngụm như một làn gió mát mùa hè, khiến bạn muốn thưởng thức mãi không dừng.",
                price: { M: 55000, L: 63000, XL: 70000 },
                category_id: 3,
                images: "Ô LONG ĐÀO HỒNG (Size La).jpg",
            },
            {
                name: "GẤM",
                description:
                    "Gấm - Vị trà Ô Long hòa quyện cùng trái vải căng mọng, mang đến dư vị ngọt mát và thanh khiết giải nhiệt tuyệt vời cho ngày hè.",
                price: { M: 52000, L: 60000, XL: 70000 },
                category_id: 3,
                images: "GẤM.jpg",
            },
            {
                name: "TẤM",
                description:
                    "Trà Ô Long đậm đà kết hợp hài hoà với gạo rang thơm bùi.",
                price: { M: 45000, L: 53000, XL: 65000 },
                category_id: 4,
                images: "Tấm.jpg",
            },
            {
                name: "KHÓI B'LAO",
                description:
                    "Sự hoà quyện của các tầng hương: Nốt hương đầu là khói đậm, hương giữa là khói nhẹ & đọng lại ở hậu vị là hương hoa ngọc lan.",
                price: { M: 45000, L: 53000, XL: 65000 },
                category_id: 4,
                images: "KHÓI B_LAO.jpg",
            },
            {
                name: "SỮA CHUA BÒNG BƯỞI",
                description:
                    "Vị chua dịu của sữa chua được cân bằng bởi topping bưởi giòn ngọt. Đây là sự kết hợp vừa thanh mát vừa bổ dưỡng, đem lại trải nghiệm mới lạ.",
                price: { M: 53000, L: 63000, XL: 72000 },
                category_id: 5,
                images: "sua chua bong buoi.jpg",
            },
            {
                name: "BÒNG BƯỞI - Ô LONG BƯỞI NHA ĐAM",
                description:
                    "Sự kết hợp độc đáo giữa vị bưởi tươi mát, nha đam giòn ngọt và trà Ô Long thanh khiết. Đây là thức uống cân bằng hoàn hảo giữa vị chua thanh và ngọt dịu, để lại ấn tượng khó quên.",
                price: { M: 53000, L: 63000, XL: 72000 },
                category_id: 5,
                images: "BÒNG BƯỞI - Ô LONG BƯỞI NHA ĐAM.jpg",
            },
            {
                name: "LANG BIANG",
                description:
                    "Lang Biang hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ.",
                price: { M: 50000, L: 60000, XL: 69000 },
                category_id: 5,
                images: "LANG BIANG.jpg",
            },
            {
                name: "SI MƠ - COLD BREW Ô LONG MƠ ĐÀO",
                description:
                    "Trà Ô Long Đặc Sản ủ lạnh, kết hợp cùng Mơ Má Đào và Đào Hồng dầm, thêm Thạch Trà Vỏ mềm dai mang đến hương vị thanh mát & nhẹ nhàng",
                price: { M: 60000, L: 72000, XL: 80000 },
                category_id: 5,
                images: "SI MƠ - COLD BREW Ô LONG MƠ ĐÀO (size La).jpg",
            },
            {
                name: "MATCHA PHAN XI PĂNG",
                description:
                    "Vị matcha đậm chất núi rừng, chát nhẹ nhưng thanh thoát, kết hợp cùng sữa béo mượt mà. Thức uống mang đến cảm giác vừa mạnh mẽ vừa dịu êm, như một chuyến phiêu lưu đầy năng lượng.",
                price: { M: 60000, L: 72000, XL: 80000 },
                category_id: 6,
                images: "MATCHA PHAN XI PĂNG.jpg",
            },
            {
                name: "MATCHA COCO LATTE",
                description:
                    "Hương matcha xanh mát kết hợp với sự ngọt ngào của sữa dừa, tạo nên thức uống lạ miệng nhưng vô cùng dễ nghiện. Sự hòa quyện độc đáo này vừa béo ngậy vừa thanh mát, thích hợp cho cả ngày dài.",
                price: { M: 60000, L: 72000, XL: 80000 },
                category_id: 6,
                images: "MATCHA COCO LATTE.jpg",
            },
            {
                name: "THẠCH TRÀ CHANH VÀNG",
                description:
                    "Miếng thạch dẻo mát, kết hợp cùng hương chanh vàng tươi sáng, mang lại cảm giác sảng khoái khi thêm vào ly trà. Sự kết hợp này làm thức uống trở nên hấp dẫn và lôi cuốn hơn.",
                price: 10000,
                category_id: 7,
                images: "thach tra chanh vang.jpg",
            },

            {
                name: "THẠCH XỈU VANI",
                description:
                    "Thạch mềm mịn với hương vani ngọt ngào, béo ngậy. Khi hòa cùng cà phê hoặc trà sữa, topping này tạo nên sự thú vị và phong phú trong từng ngụm.",
                price: 10000,
                category_id: 7,
                images: "THẠCH XỈU VANI.jpg",
            },
            {
                name: "THẠCH TRÀ ĐÀO HỒNG",
                description:
                    "Thạch Ô Long Đào Hồng mềm dai - không chất bảo quản - thủ công sáng tạo từ Trà Ô Long Đặc Sản & Đào Hồng Dầm. Phù hợp với tất cả sản phẩm Trà Trái Cây tại Phê La",
                price: 12000,
                category_id: 7,
                images: "THẠCH TRÀ ĐÀO HỒNG.jpg",
            },
            {
                name: "THẠCH Ô LONG MATCHA",
                description:
                    "Thạch Ô Long Matcha mềm mượt - không chất bảo quản - thủ công sáng tạo từ Trà Ô Long Matcha & Sữa Dừa Bến Tre. Phù hợp với mọi sản phẩm trà sữa và Ô Long Matcha tại Phê La.",
                price: 12000,
                category_id: 7,
                images: "THẠCH Ô LONG MATCHA.jpg",
            },
            {
                name: "THẠCH TRÀ VỎ",
                description:
                    "Thạch Trà Vỏ mềm dai - không chất bảo quản - thủ công sáng tạo từ Trà Vỏ Cà Phê & Ô Mai Dây gia truyền (Xí Muội). Phù hợp với mọi trà trái cây tại Phê La.",
                price: 12000,
                category_id: 7,
                images: "THẠCH TRÀ VỎ.jpg",
            },
            {
                name: "TRÂN CHÂU PHONG LAN",
                description:
                    "Trân Châu Phong Lan giòn dai - không chất bảo quản, xen lẫn hạt Vani đen tự nhiên & hương vị nhẹ nhàng. Phù hợp với mọi đồ uống tại Phê La.",
                price: 12000,
                category_id: 7,
                images: "TRÂN CHÂU PHONG LAN.jpg",
            },
            {
                name: "TRÂN CHÂU GẠO RANG",
                description:
                    "Trân châu mềm dẻo - vị trà Ô Long hoà quyện cùng gạo rang thơm bùi nhẹ nhàng. Phù hợp thưởng thức cùng trà sữa. Không chất bảo quản. Nguyên bản - thủ công.",
                price: 14000,
                category_id: 7,
                images: "TRÂN CHÂU GẠO RANG.jpg",
            },
            {
                name: "PLUS - KHÓI B’LAO",
                description:
                    "Hương vị cà phê đậm đà được cô đọng trong chai tiện lợi, mang theo dư vị khói đặc trưng của cao nguyên. Một lựa chọn hoàn hảo cho những ai bận rộn nhưng vẫn muốn tận hưởng hương vị cà phê trọn vẹn.",
                price: 108000,
                category_id: 8,
                images: "PLUS - KHÓI B_LAO.jpg",
            },
            {
                name: "PLUS - ĐỈNH PHÙ VÂN",
                description:
                    "(100% đường) Chai 250ml. Đỉnh Phù Vân là sự kết hợp tinh tế giữa Trà Ô Long Đỏ đậm đà và kem whipping nhẹ nhàng, tạo nên lớp sánh ngậy",
                price: 138000,
                category_id: 8,
                images: "PLUS - ĐỈNH PHÙ VÂN.jpg",
            },
            {
                name: "PLUS - COLD BREW ",
                description:
                    "Cà phê được ủ lạnh nhiều giờ để chiết xuất vị ngọt dịu và giảm bớt độ đắng gắt. Kết quả là một thức uống tươi mát, nhẹ nhàng nhưng vẫn giữ được chiều sâu hương vị.",
                price: 98182,
                category_id: 8,
                images: "PLUS - COLD BREW.jpg",
            },
            {
                name: "PLUS - Ô LONG SỮA PHÊ LA",
                description:
                    "Trà Ô Long đậm đà hòa quyện cùng vị sữa thơm ngậy, mang đến trải nghiệm uống mượt mà và tinh tế.",
                price: 108000,
                category_id: 8,
                images: "PLUS - Ô LONG SỮA PHÊ LA.jpg",
            },
            {
                name: "PLUS - Ô LONG NHÀI SỮA",
                description:
                    "Trà Ô Long đậm đà hòa quyện cùng vị sữa thơm ngậy, mang đến trải nghiệm uống mượt mà và tinh tế.",
                price: 108000,
                category_id: 8,
                images: "PLUS - Ô LONG NHÀI SỮA.jpg",
            },
            {
                name: "PLUS - TẤM",
                description:
                    "Trà Ô Long kết hợp hài hòa với gạo rang thơm bùi, mang đến dư vị ngọt nhẹ và thanh mát.",
                price: 108000,
                category_id: 8,
                images: "PLUS - TẤM.jpg",
            },
            {
                name: "PLUS - PHONG LAN",
                description:
                    "Trà Ô Long hòa quyện cùng vani tự nhiên, vị nhẹ nhàng, tinh tế và để lại dư vị lâu dài.",
                price: 108000,
                category_id: 8,
                images: "PLUS - PHONG LAN.jpg",
            },
            {
                name: "PLUS - ĐÀ LẠT ",
                description:
                    "Lấy cảm hứng từ khí hậu se lạnh, trong lành của Đà Lạt, loại cà phê đóng chai này mang lại cảm giác tươi mới, cân bằng và đầy lãng mạn.",
                price: 137000,
                category_id: 8,
                images: "PLUS - ĐÀ LẠT.jpg",
            },
            {
                name: "PLUS - LỤA ĐÀO",
                description:
                    "Trà Ô Long kết hợp cùng hương đào ngọt ngào, mang đến trải nghiệm mới lạ và tươi mát.",
                price: 108000,
                category_id: 8,
                images: "PLUS - LỤA ĐÀO.jpg",
            },
            {
                name: "PLUS - MATCHA COCO LATTE",
                description:
                    "Sự kết hợp hoàn hảo giữa matcha và nước cốt dừa, tạo nên hương vị đặc biệt và thơm ngon.",
                price: 108000,
                category_id: 8,
                images: "PLUS - MATCHA COCO LATTE.jpg",
            },
            {
                name: "BỌT BIỂN PHÊ LA – Ô LONG SỮA PHÊ LA",
                description:
                    "Một phiên bản tiện lợi của Ô Long Sữa Phê La, giúp bạn thưởng thức hương vị đặc trưng ngay tại nhà.",
                price: 25000,
                category_id: 12,
                images: "BỌT BIỂN PHÊ LA – Ô LONG SỮA PHÊ LA.jpg",
            },
            {
                name: "BỌT BIỂN PHÊ LA – PHÊ LATTE",
                description:
                    "Mang đến hương vị Phê Latte đặc trưng trong một phiên bản tiện lợi.",
                price: 25000,
                category_id: 12,
                images: "BỌT BIỂN PHÊ LA – PHÊ LATTE.jpg",
            },
            {
                name: "BỌT BIỂN PHÊ LA – PHÊ NÂU",
                description:
                    "Trải nghiệm hương vị Phê Nâu ngay tại nhà với sản phẩm tiện lợi này.",
                price: 25000,
                category_id: 12,
                images: "BỌT BIỂN PHÊ LA – PHÊ NÂU.jpg",
            },
            {
                name: "BỌT BIỂN PHÊ LA – TRÂN CHÂU GẠO RANG",
                description:
                    "Kết hợp hương vị đặc trưng của trân châu gạo rang trong một phiên bản tiện lợi.",
                price: 25000,
                category_id: 12,
                images: "BỌT BIỂN PHÊ LA – TRÂN CHÂU GẠO RANG.jpg",
            },
            {
                name: "BỌT BIỂN PHÊ LA – XE VAN",
                description:
                    "Mang đến hương vị đặc trưng của Phê La trong một phiên bản tiện lợi.",
                price: 25000,
                category_id: 12,
                images: "BỌT BIỂN PHÊ LA – XE VAN.jpg",
            },
            {
                name: "CÀ PHÊ PHIN GIẤY – PHÊ ĐẶC SẢN",
                description:
                    "Trải nghiệm hương vị cà phê đặc sản qua phương pháp phin giấy tiện lợi.",
                price: 442000,
                category_id: 10,
                images: "CÀ PHÊ PHIN GIẤY – PHÊ ĐẶC SẢN.jpg",
            },
            {
                name: "CÀ PHÊ PHIN GIẤY – PHÊ NGUYÊN BẢN",
                description:
                    "Trải nghiệm hương vị cà phê đặc sản qua phương pháp phin giấy tiện lợi.",
                price: 442000,
                category_id: 10,
                images: "CÀ PHÊ PHIN GIẤY – PHÊ NGUYÊN BẢN.jpg",
            },
            {
                name: "CÀ PHÊ PHIN GIẤY –  PHÊ TRUFFLE",
                description:
                    "Hương vị cà phê nguyên bản qua phương pháp phin giấy.",
                price: 442000,
                category_id: 10,
                images: "CÀ PHÊ PHIN GIẤY –  PHÊ TRUFFLE.jpg",
            },
            {
                name: "PHÊ PHIN NGUYÊN BẢN - TÚI 200GR",
                description:
                    "Một trong những dòng cà phê danh giá nhất thế giới, nổi bật với hương hoa nhài và trái cây nhiệt đới. Từng ngụm cà phê Geisha là một trải nghiệm tinh tế, khó tìm thấy ở nơi khác.",
                price: 480000,
                category_id: 9,
                images: "PHÊ PHIN NGUYÊN BẢN - TÚI 200GR.jpg",
            },
            {
                name: "PHÊ GEISHA - TÚI 150GR",
                description:
                    "Một trong những dòng cà phê danh giá nhất thế giới, nổi bật với hương hoa nhài và trái cây nhiệt đới. Từng ngụm cà phê Geisha là một trải nghiệm tinh tế, khó tìm thấy ở nơi khác.",
                price: 418000,
                category_id: 9,
                images: "PHÊ GEISHA - TÚI 150GR.jpg",
            },

            {
                name: "PHÊ ETHIOPIA - TÚI 150GR",
                description:
                    "Hạt cà phê từ vùng đất Ethiopia mang đặc trưng vị trái cây nhiệt đới, hậu vị ngọt tự nhiên và hương hoa thoang thoảng. Đây là lựa chọn lý tưởng cho những ai yêu thích pour-over.",
                price: 346000,
                category_id: 9,
                images: "PHÊ ETHIOPIA - TÚI 150GR.jpg",
            },
            {
                name: "Phê Kenya - Túi 150gr",
                description:
                    "Nổi bật với vị chua sáng, hương cam chanh và dâu tây rõ rệt, cà phê Kenya đem lại sự bùng nổ hương vị. Một lựa chọn táo bạo dành cho tín đồ cà phê cá tính.",
                price: 370000,
                category_id: 9,
                images: "Phê Kenya - Túi 150gr.jpg",
            },
            {
                name: "Phê Colombia - Túi 150gr",
                description:
                    "Hương vị cân bằng tuyệt vời, vừa có chút đắng vừa phảng phất vị ngọt caramel và chocolate. Đây là dòng cà phê thân thiện, dễ uống, phù hợp cho mọi đối tượng.",
                price: 395000,
                category_id: 9,
                images: "Phê Colombia - Túi 150gr.jpg",
            },
            {
                name: "Ô LONG MÙA XUÂN ĐẶC SẢN - TÚI 150GR",
                description:
                    "Được hái từ những đồi trà xanh mướt vào mùa xuân, loại trà này có vị thanh ngọt và hậu vị hoa cỏ quyến rũ. Thích hợp để nhâm nhi vào những buổi sáng nhẹ nhàng.",
                price: 344000,
                category_id: 9,
                images: "Ô LONG MÙA XUÂN ĐẶC SẢN - TÚI 150GR.jpg",
            },
            {
                name: "COMBO XÚNG XÍNH LỤA ĐÀO",
                description:
                    "Combo gồm các loại trà sữa tiện lợi, phù hợp cho những buổi chill tại nhà.",
                price: 130000,
                category_id: 10,
                images: "COMBO XÚNG XÍNH LỤA ĐÀO.jpg",
            },
            {
                name: "TÚI TOTE HAPPY CHILL DAY - ĐAI TRƠN",
                description:
                    "Gói gọn cả thế giới chỉ trong một “nốt nhạc”, Túi Tote Happy Chill Day Phiên bản đai trơn với chất liệu canvas dày dặn, kích thước 39x32x9cm, thiết kế ngăn trong tiện lợi, sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.",
                price: 107000,
                category_id: 12,
                images: "TÚI TOTE HAPPY CHILL DAY - ĐAI TRƠN.jpg",
            },
            {
                name: "Túi Tote Happy Chill Day - Đai Khuông Nhạc",
                description:
                    "Gói gọn cả thế giới chỉ trong một “nốt nhạc”, Túi Tote Happy Chill Day Phiên bản đai trơn với chất liệu canvas dày dặn, kích thước 39x32x9cm, thiết kế ngăn trong tiện lợi, sẵn sàng đồng hành cùng bạn ở bất cứ nơi đâu.",
                price: 107000,
                category_id: 12,
                images: "Túi Tote Happy Chill Day - Đai Khuông Nhạc.jpg",
            },
            {
                name: "HỘP QUÀ ĐĨA NHẠC – HỘP 04 LOẠI (03 TRÀ HẠT, 01 CÀ PHÊ PHIN)",
                description:
                    "Hộp quà gồm 4 loại đồ uống đặc trưng, phù hợp làm quà tặng hoặc thưởng thức tại nhà.",
                price: 737000,
                category_id: 10,
                images: "HỘP QUÀ ĐĨA NHẠC.jpg ",
            },

            {
                name: "HỘP QUÀ PHIN GIẤY – HỘP 02 LOẠI Ô LONG SỮA/ Ô LONG NHÀI",
                description:
                    "Gồm 2 loại phin giấy Ô Long Sữa và Ô Long Nhài, mang đến trải nghiệm pha chế thủ công tại nhà.",
                price: 590000,
                category_id: 10,
                images: "HỘP QUÀ PHIN GIẤY – HỘP 02 LOẠI Ô LONG SỮA.jpg",
            },
            {
                name: "HỘP QUÀ TRÀ SỮA TIỆN LỢI – HỘP 06 LY, 04 LOẠI",
                description:
                    "Gồm 6 ly trà sữa tiện lợi với 4 hương vị khác nhau, phù hợp cho những buổi tụ tập tại nhà.Hộp 06 ly, 04 loại:Ô Long Sữa Phê La x2, Ô Long Nhài Sữa x2,Ô Long Đào Sữa x1,Tấm x1.",
                price: 577000,
                category_id: 10,
                images: "HỘP QUÀ TRÀ SỮA TIỆN LỢI.jpg",
            },
            {
                name: "Ô LONG NHÀI SỮA PHIN GIẤY PHÊ LA",
                description:
                    "Trà Ô Long Nhài Sữa được đóng gói dạng phin giấy tiện lợi, mang đến trải nghiệm thưởng thức trà tại nhà một cách dễ dàng và nhanh chóng.",
                price: 387000,
                category_id: 10,
                images: "Ô LONG NHÀI SỮA PHIN GIẤY PHÊ LA.jpg",
            },
        ];
        for (const p of products) {
            const product = await prisma.products.create({
                data: {
                    name: p.name,
                    description: p.description,
                    category_id: p.category_id,
                    images: p.images,
                },
            });
            let priceData = [];
            if (typeof p.price === "object") {
                // Trường hợp nhiều size
                priceData = Object.entries(p.price).map(([size, price]) => ({
                    product_id: product.product_id,
                    size,
                    price,
                }));
            } else {
                // Trường hợp 1 giá duy nhất
                priceData = [
                    {
                        product_id: product.product_id,
                        size: product_size.DEFAULT, // hoặc "DEFAULT"
                        price: p.price,
                    },
                ];
            }
            await prisma.price_product.createMany({
                data: priceData,
            });
        }
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
