import { prisma } from "../config/client";

import {
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfWeek,
    endOfWeek,
    subWeeks,
    startOfYear,
    endOfYear,
    subYears,
} from "date-fns";
import { hashPassword } from "../config/seed";
import { TOTAL_ITEMS_PER_PAGE } from "../config/constant";
import { Prisma } from "@prisma/client";

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
                staff_detail: {
                    include: {
                        staff_schedules: {
                            include: {
                                work_shifts: true,
                            },
                        },
                    },
                },
            },
        });
        return staffs;
    };

    getCalanderStaff = async () => {
        return await prisma.users.findMany({
            where: {
                role_id: 2,
            },
            include: {
                staff_detail: {
                    include: {
                        staff_schedules: {
                            include: {
                                work_shifts: true,
                            },
                        },
                    },
                },
            },
        });
    };

    getWorkShiftStaff = async () => {
        return await prisma.staff_schedules.findFirst({
            include: {
                work_shifts: true,
            },
        });
    }

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
        salary?: number,
        shiftId?: number
    ) => {
        try {
            const parsedBirthday = birthday ? new Date(birthday) : null;
            const defaultPassword = await hashPassword(password);
            const newUser = await prisma.users.create({
                data: {
                    username,
                    email,
                    phone,
                    birthday: parsedBirthday,
                    address,
                    gender,
                    password: defaultPassword,
                    avatar,
                    role_id: +2,
                    staff_detail: {
                        create: {
                            salary: salary ?? 0,
                            position: position ?? "chua co",
                            staff_schedules: {
                                create: Array.from({ length: 7 }, (_, i) => ({
                                    day_of_week: i + 1,
                                    shift_id: shiftId,
                                    status: "WORK",
                                })),
                            },
                        },
                    },
                },
                include: {
                    roles: true,
                    staff_detail: {
                        include: {
                            staff_schedules: {
                                include: {
                                    work_shifts: true,
                                },
                            },
                        },
                    },
                },
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

    getAllShift = async () => {
        const shifts = await prisma.work_shifts.findMany();
        return shifts;
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
        const defaultPassword = await hashPassword(password);
        const updateStaff = await prisma.users.update({
            where: {
                user_id: +id,
            },
            data: {
                email: email,
                username: username,
                password: defaultPassword,
                phone: phone,
                address: address,
                ...(avatar !== undefined && { avatar: avatar }),
            },
        });

        return updateStaff;
    };

    handleSearchStaff = async (
        pageStaff: number,
        username: string,
        email: string
    ) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (pageStaff - 1) * pageSize;

        const where: any = {
            role_id: { in: [2] },
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
                staff_detail: true,
            },
            orderBy: {
                user_id: "asc",
            },
        });

        return searchStaff;
    };

    handleSearchCustomer = async (
        pageCustomer: number,
        username: string,
        email: string
    ) => {
        const pageSize = TOTAL_ITEMS_PER_PAGE;
        const skip = (pageCustomer - 1) * pageSize;

        const where: any = {
            role_id: { in: [3] },
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
                staff_detail: true,
            },
            orderBy: {
                user_id: "asc",
            },
        });

        return searchCustomer;
    };

    getStaffRevenue = async (userId: number, period: string) => {
        const staff = await prisma.staff_detail.findUnique({
            where: { user_id: userId },
        });

        if (!staff) {
            throw new Error("Không tìm thấy thông tin staff cho user này");
        }
        let start: Date;
        let end: Date;
        let labels: string[] = [];
        let revenues: number[] = [];

        // Xác định khoảng thời gian dựa trên "period"
        const count = 6; // Số mốc thời gian gần nhất

        if (period === "week") {
            for (let i = count - 1; i >= 0; i--) {
                const startOfWeekRange = startOfWeek(subWeeks(new Date(), i), {
                    weekStartsOn: 1,
                });
                const endOfWeekRange = endOfWeek(subWeeks(new Date(), i), {
                    weekStartsOn: 1,
                });

                const orders = await prisma.orders.findMany({
                    where: {
                        // staff: {
                        //     user_id: userId,
                        // },
                        orderDate: {
                            gte: startOfWeekRange,
                            lte: endOfWeekRange,
                        },
                    },
                    select: {
                        final_amount: true,
                    },
                });

                const totalRevenue = orders.reduce(
                    (sum, order) => sum + Number(order.final_amount),
                    0
                );
                labels.push(
                    `${startOfWeekRange.getDate()}/${startOfWeekRange.getMonth() + 1
                    } - ${endOfWeekRange.getDate()}/${endOfWeekRange.getMonth() + 1
                    }`
                );
                revenues.push(totalRevenue);
            }
        } else if (period === "year") {
            for (let i = count - 1; i >= 0; i--) {
                const startOfYearRange = startOfYear(subYears(new Date(), i));
                const endOfYearRange = endOfYear(subYears(new Date(), i));

                const orders = await prisma.orders.findMany({
                    where: {
                        // staff: {
                        //     user_id: userId,
                        // },
                        orderDate: {
                            gte: startOfYearRange,
                            lte: endOfYearRange,
                        },
                    },
                    select: {
                        final_amount: true,
                    },
                });

                const totalRevenue = orders.reduce(
                    (sum, order) => sum + Number(order.final_amount),
                    0
                );
                labels.push(`${startOfYearRange.getFullYear()}`);
                revenues.push(totalRevenue);
            }
        } else {
            // Mặc định là "month"
            for (let i = count - 1; i >= 0; i--) {
                const startOfMonthRange = startOfMonth(
                    subMonths(new Date(), i)
                );
                const endOfMonthRange = endOfMonth(subMonths(new Date(), i));

                const orders = await prisma.orders.findMany({
                    where: {
                        // staff: {
                        //     user_id: userId,
                        // },
                        orderDate: {
                            gte: startOfMonthRange,
                            lte: endOfMonthRange,
                        },
                    },
                    select: {
                        final_amount: true,
                    },
                });

                const totalRevenue = orders.reduce(
                    (sum, order) => sum + Number(order.final_amount),
                    0
                );
                labels.push(
                    `${startOfMonthRange.getMonth() + 1
                    }/${startOfMonthRange.getFullYear()}`
                );
                revenues.push(totalRevenue);
            }
        }

        return {
            labels,
            revenues,
        };
    };


    handleUpdateStaffCalander = async (
        userId: number,
        shiftId: number,
        dayOfWeek: number
    ) => {
        try {
            // ✅ Bước 1: Lấy staff_id từ user_id
            const staffDetail = await prisma.staff_detail.findUnique({
                where: { user_id: userId },
                select: { staff_id: true }
            });

            if (!staffDetail) {
                throw new Error(`Không tìm thấy staff_detail cho user_id: ${userId}`);
            }

            // ✅ Bước 2: Upsert với staff_id đúng
            const result = await prisma.staff_schedules.upsert({
                where: {
                    staff_id_day_of_week: {
                        staff_id: staffDetail.staff_id, // ← Dùng staff_id, không phải user_id
                        day_of_week: dayOfWeek
                    }
                },
                update: {
                    shift_id: shiftId,
                    status: "WORK"
                },
                create: {
                    staff_id: staffDetail.staff_id,
                    day_of_week: dayOfWeek,
                    shift_id: shiftId,
                    status: "WORK"
                },
                include: {
                    work_shifts: true // Trả về thông tin ca làm việc
                }
            });

            return result;
        } catch (error) {
            console.error("Error in handleUpdateStaffCalander:", error);
            throw error;
        }
    };

    getStaffIdFromUserId = async (userId: number): Promise<number | null> => {
        const staffDetail = await prisma.staff_detail.findUnique({
            where: { user_id: userId },
            select: { staff_id: true }
        });
        return staffDetail?.staff_id ?? null;
    };




}

export default new AdminUserService();