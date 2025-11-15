//controller cua admin
import { Request, Response } from "express";
import AdminUserService from "../../services/user.service";
import orderService from "../../services/order.service";

class AdminUserController {
    // user phan customer
    getAdminCustomerPage = async (req: Request, res: Response) => {
        const { pageCustomer } = req.query;

        let currentPageCustomer = pageCustomer ? +pageCustomer : 1;
        if (currentPageCustomer <= 0) {
            currentPageCustomer = 1;
        }

        const customers = await AdminUserService.getUserCustomer(
            "CUSTOMER",
            currentPageCustomer
        ); //customer pagination

        const totalPagesCustomer =
            await AdminUserService.countTotalUserPagesByRole("CUSTOMER");

        const roles = await AdminUserService.getAllRoles(); // lấy tất cả role

        const totalAmount = await orderService.getAllOrders();

        const genderOptions = [
            { name: "Nữ", value: "man" },
            { name: "Nam", value: "woman" },
        ];
        return res.render("admin/users/view_customer.ejs", {
            customers: customers,
            roles: roles,
            totalPagesCustomer: +totalPagesCustomer,
            pageCustomer: currentPageCustomer,
            genderOptions: genderOptions,
            totalAmount: totalAmount,
        });
    };

    getViewDetailCustomerAdminPage = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await AdminUserService.getDetailCustomerById(+id);

        return res.render("admin/users/detail_customer.ejs", {
            user: user,
        });
    };

    postDeleteCustomer = async (req: Request, res: Response) => {
        const { id } = req.params;
        await AdminUserService.handleDeleteUser(+id);
        return res.redirect("/admin/customer");
    };

    postLockCustomer = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleLockUser(+id);

            return res.redirect("/admin/customer");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    postUnlockCustomer = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleUnlockUser(+id);

            return res.redirect("/admin/customer");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    getCustomerSearch = async (req: Request, res: Response) => {
        try {
            const username = req.query.username?.toString().trim() || "";
            const email = req.query.username?.toString().trim() || "";
            const { pageCustomer } = req.query;
            let currentPageCustomer = +pageCustomer ? +pageCustomer : 1;

            if (currentPageCustomer <= 0) {
                currentPageCustomer = 1;
            }

            const customers = await AdminUserService.handleSearchCustomer(
                +currentPageCustomer,
                username,
                email
            );
            res.json(customers);
        } catch (err) {
            res.status(401).json("có lỗi xảy ra");
        }
    };
    // end user phan customer

    // user phan admin phan staff
    getAdminStaffPage = async (req: Request, res: Response) => {
        const { pageStaff } = req.query;

        let currentPageStaffs = pageStaff ? +pageStaff : 1;
        if (currentPageStaffs <= 0) {
            currentPageStaffs = 1;
        }

        const staffs = await AdminUserService.getAdminandStaff(
            currentPageStaffs
        ); //customer pagination

        const totalPageStaffs =
            await AdminUserService.countTotalStaffAndAdminPages();

        const roles = await AdminUserService.getAllRoles(); // lấy tất cả role
        const workShifts = await AdminUserService.getAllShift();
        const staffCalender = await AdminUserService.getCalanderStaff();

        const genderOptions = [
            { name: "Nữ", value: "Nữ" },
            { name: "Nam", value: "Nam" },
        ];

        return res.render("admin/users/view_staff.ejs", {
            staffs: staffs,
            roles: roles,
            totalPageStaffs: +totalPageStaffs,
            pageStaff: currentPageStaffs,
            genderOptions: genderOptions,
            workShifts: workShifts,
            staffCalender: staffCalender,
        });
    };

    getViewDetailStaffAdminPage = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await AdminUserService.getDetailCustomerById(+id);
        const roleOptions = [
            { name: "Pha chế", value: "Pha chế" },
            { name: "Phục vụ", value: "Phục vụ" },
            { name: "Bảo vệ", value: "Bảo vệ" },
            { name: "Lao công", value: "Lao công" },
        ];
        return res.render("admin/users/detail_staff.ejs", {
            user: user,
            roleOptions: roleOptions,
        });
    };

    postCreateUser = async (req: Request, res: Response) => {
        const {
            username,
            email,
            phone,
            birthday,
            address,
            gender,
            password,
            position,
            salary,
            shiftId,
        } = req.body;
        const file = req.file;
        const avatar = file?.filename ?? null;

        await AdminUserService.handleCreateUser(
            username,
            email,
            phone,
            birthday,
            address,
            gender,
            password,
            avatar,
            position,
            +salary,
            +shiftId
        );
        //success
        return res.redirect("/admin/staff");
    };

    postUpdateStaff = async (req: Request, res: Response) => {
        const { id, username, email, password, phone, address, oldAvatar } =
            req.body;
        const file = req.file;
        const avatar = file?.filename ?? oldAvatar;

        await AdminUserService.handleUpdateStaffById(
            id,
            username,
            email,
            password,
            phone,
            address,
            avatar
        );
        return res.redirect(`/admin/staff/detail_staff/${id}`);
    };

    postDeleteStaff = async (req: Request, res: Response) => {
        const { id } = req.params;
        await AdminUserService.handleDeleteUser(+id);
        return res.redirect("/admin/staff");
    };

    postLockStaff = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleLockUser(+id);

            return res.redirect("/admin/staff");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    postUnlockStaff = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleUnlockUser(+id);

            return res.redirect("/admin/staff");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    getSearchStaff = async (req: Request, res: Response) => {
        try {
            const username = req.query.username?.toString().trim() || "";
            const email = req.query.email?.toString().trim() || "";

            const { pageStaff } = req.query;
            let currentPageStaffs = +pageStaff ? +pageStaff : 1;
            if (currentPageStaffs <= 0) {
                currentPageStaffs = 1;
            }

            const staffs = await AdminUserService.handleSearchStaff(
                currentPageStaffs,
                username,
                email
            );
            res.json(staffs);
        } catch (err) {
            res.status(500).json({ error: "Có lỗi xảy ra" });
        }
    };

    getStaffRevenueAPI = async (req: Request, res: Response) => {
        try {
            const { staffId, period = "month" } = req.query;
            if (!staffId)
                return res.status(400).json({ error: "Missing staffId" });

            const data = await AdminUserService.getStaffRevenue(
                +staffId,
                period as string
            );
            return res.json(data);
        } catch (err) {
            console.error("Error fetching staff revenue API:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    getStaffRevenue = async (req: Request, res: Response) => {
        try {
            const { staffId, period = "month" } = req.query;
            if (!staffId) return res.status(400).send("Missing staffId");

            const data = await AdminUserService.getStaffRevenue(
                +staffId,
                period as string
            );
            return res.render("admin/users/detail_staff.ejs", {
                data,
            });
        } catch (err) {
            console.error("Error rendering staff revenue:", err);
            return res.status(500).send("Internal Server Error");
        }
    };

    // end user phan admin phan staff
}

export default new AdminUserController();
