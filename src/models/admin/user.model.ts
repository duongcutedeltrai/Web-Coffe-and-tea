import { TOTAL_ITEM_PER_PAGE } from "../../config/constant";
import { prisma } from "../../config/client";
import { Prisma } from "@prisma/client";

const getUserCustomer = async (role: string, page: number) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const skip = (page - 1) * pageSize
    const viewUser = await prisma.users.findMany({
        where: {
            roles: {
                name: role
            }
        },

        skip: skip,
        take: pageSize,
        include: {
            roles: true,
            orders: true
        }
    });

    return viewUser;
}

const getAdminandStaff = async (page: number) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const skip = (page - 1) * pageSize;

    return await prisma.users.findMany({
        where: {
            roles: {
                name: {
                    in: ["STAFF", "ADMIN"]
                }
            }
        },
        skip,
        take: pageSize,
        include: {
            roles: true,
            orders: true
        }
    });
}



const countTotalUserPagesByRole = async (role: string,) => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const totalItems = await prisma.users.count({
        where: { roles: { name: role } }
    });
    const totalPages = Math.ceil(totalItems / pageSize)
    return totalPages
};

const countTotalStaffAndAdminPages = async () => {
    const pageSize = TOTAL_ITEM_PER_PAGE;
    const totalItems = await prisma.users.count({
        where: {
            roles: {
                name: { in: ["STAFF", "ADMIN"] }
            }
        }
    });
    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
};

const getAllRoles = async () => {
    const roles = await prisma.roles.findMany();
    return roles;
}

const getOptionRole = async () => {
    return await prisma.roles.findMany({
        where: {
            name: {
                in: ["ADMIN", "STAFF"]
            }
        }
    })
}


const handleCreateUser = async (
    username: string,
    email: string,
    phone: string,
    roleId: number,
    gender: string,
    birthday: string,
    address: string,
    password: string,
    avatar: string
) => {
    try {
        const parsedBirthday = birthday ? new Date(birthday) : null;
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                phone,
                gender,
                birthday: parsedBirthday,
                address,
                password,
                avatar,
                roles: {
                    connect: { role_id: +roleId }
                },
            },
            include: { roles: true }
        });

        return newUser;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            // Lỗi unique constraint
            throw new Error("Email đã tồn tại");
        }
        throw err;
    }
};



const handleDeleteUser = async (id: number) => {
    return await prisma.users.delete({
        where: {
            user_id: id
        }
    })
}

const handleLockUser = async (id: number) => {
    return await prisma.users.update({
        where: {
            user_id: id
        },
        data: {
            status: "LOCKED"
        }
    })
}

const handleUnlockUser = async (id: number) => {
    return await prisma.users.update({
        where: {
            user_id: id
        },
        data: {
            status: "ACTIVE"
        }
    })
}

const getDetailCustomerById = async (id: number) => {
    const viewDetail = prisma.users.findUnique({
        where: {
            user_id: id
        },
        include: {
            orders: {
                include: {
                    order_details: {
                        include: {
                            products: true
                        }
                    }
                }
            },

        }
    })
    return viewDetail
}

const handleUpdateStaffById = async (id: number, username: string, email: string, password: string, phone: string, address: string, avatar: string) => {


    const updateStaff = await prisma.users.update({
        where: {
            user_id: +id
        },
        data: {
            email: email,
            username: username,
            password: password,
            phone: phone,
            address: address,
            ...(avatar !== undefined && { avatar: avatar }),

        }
    })


    return updateStaff
}


export { getUserCustomer, handleCreateUser, getAllRoles, handleDeleteUser, getDetailCustomerById, getOptionRole, handleLockUser, handleUnlockUser, handleUpdateStaffById, countTotalUserPagesByRole, getAdminandStaff, countTotalStaffAndAdminPages }