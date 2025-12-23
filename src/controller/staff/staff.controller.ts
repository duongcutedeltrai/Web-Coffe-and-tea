
import { Request, Response } from "express";
import { prisma } from "../../config/client";
class StaffController {
    getCalendarPage = async (req: Request, res: Response) => {
        const user = await prisma.staff_detail.findFirst()

        if (!user) {
            return res.redirect("/auth/login");
        }
        const staffCalender = await prisma.users.findMany({
            where: {
                user_id: user.user_id
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
        })


        return res.render("staff/calander", { staffCalender });
    }
}
export default new StaffController();