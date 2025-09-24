import { TOTAL_ITEMS_PER_PAGE } from "../../config/constant";
import { prisma } from "../../config/client";
import { Prisma } from "@prisma/client";
import { name } from "ejs";
import { includes } from "zod";
import { create } from "node:domain";

class AdminUserService {

    // user phan customer
    getUserCustomer = async (role: string, page: number) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (page - 1) * pageSize;
        const viewUser = await prisma.users.findMany({
            where: {
                roles: {
                    name: role,
                },
            },

            skip: skip,
            take: pageSize,
            include: {
                roles: true,
                orders: true,
            },
        });

        return viewUser;
    };



    countTotalUserPagesByRole = async (role: string) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const totalItems = await prisma.users.count({
            where: { roles: { name: role } },
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        return totalPages;
    };

    countTotalStaffAndAdminPages = async () => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const totalItems = await prisma.users.count({
            where: {
                roles: {
                    name: { in: ["STAFF", "ADMIN"] },
                },
            },
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        return totalPages;
    };

    // end user phan customer


    // user phan staff
    getAdminandStaff = async (page: number) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (page - 1) * pageSize;

        const staffs = await prisma.users.findMany({
            where: {
                roles: {
                    name: {
                        in: ["STAFF"],
                    },
                },
            },
            skip,
            take: pageSize,
            include: {
                roles: true,
                orders: true,
                staff_detail: true
            },
        });
        return staffs
    };

    // end user phan staff


    getAllRoles = async () => {
        const roles = await prisma.roles.findMany();
        return roles;
    };

    handleCreateUser = async (
        username: string,
        email: string,
        phone: string,
        birthday: string,
        address: string,
        gender: string,
        password: string,
        avatar: string,
        position?: string,
        salary?: number
    ) => {
        try {
            const parsedBirthday = birthday ? new Date(birthday) : null;
            const newUser = await prisma.users.create({
                data: {
                    username,
                    email,
                    phone,
                    birthday: parsedBirthday,
                    address,
                    gender,
                    password,
                    avatar,
                    role_id: +15,
                    staff_detail: {
                        create: {
                            salary: salary ?? 0,
                            position: position ?? "chua co",
                        },
                    }
                },
                include: { roles: true, staff_detail: true },
            });

            return newUser;
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === "P2002"
            ) {
                // Lỗi unique constraint
                throw new Error("Email đã tồn tại");
            }
            throw err;
        }
    };

    handleDeleteUser = async (id: number) => {
        return await prisma.users.delete({
            where: {
                user_id: id,
            },
        });
    };

    handleLockUser = async (id: number) => {
        return await prisma.users.update({
            where: {
                user_id: id,
            },
            data: {
                status: "LOCKED",
            },
        });
    };

    handleUnlockUser = async (id: number) => {
        return await prisma.users.update({
            where: {
                user_id: id,
            },
            data: {
                status: "ACTIVE",
            },
        });
    };

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
                staff_detail: true,
            },
        });
        return viewDetail;
    };

    handleUpdateStaffById = async (
        id: number,
        username: string,
        email: string,
        password: string,
        phone: string,
        address: string,
        avatar: string
    ) => {
        const updateStaff = await prisma.users.update({
            where: {
                user_id: +id,
            },
            data: {
                email: email,
                username: username,
                password: password,
                phone: phone,
                address: address,
                ...(avatar !== undefined && { avatar: avatar }),
            },
        });

        return updateStaff;
    };

    handleSearchStaff = async (pageStaff: number, username: string, email: string) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (pageStaff - 1) * pageSize

        const where: any = {
            role_id: { in: [15] }
        };

        if (username || email) {
            where.OR = [];
            if (username) where.OR.push({ username: { contains: username } });
            if (email) where.OR.push({ email: { contains: email } });
        }


        const searchStaff = await prisma.users.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                roles: true,
                staff_detail: true
            },
            orderBy: {
                user_id: "asc"
            }
        });


        return searchStaff;
    }

    handleSearchCustomer = async (pageCustomer: number, username: string, email: string) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (pageCustomer - 1) * pageSize

        const where: any = {
            role_id: { in: [14] }
        };

        if (username || email) {
            where.OR = [];
            if (username) where.OR.push({ username: { contains: username } });
            if (email) where.OR.push({ email: { contains: email } });
        }


        const searchCustomer = await prisma.users.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                roles: true,
                staff_detail: true
            },
            orderBy: {
                user_id: "asc"
            }
        });


        return searchCustomer;
    }


}

export default new AdminUserService();
