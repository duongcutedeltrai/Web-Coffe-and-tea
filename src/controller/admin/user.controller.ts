//controller cua admin
import { Request, Response } from "express";
import AdminUserService from "../../services/admin/user.service";

class AdminUserController {
    getUserAdminPage = async (req: Request, res: Response) => {
        const { pageCustomer, pageStaff } = req.query;

        let currentPageCustomer = pageCustomer ? +pageCustomer : 1;
        let currentPageStaff = pageStaff ? +pageStaff : 1;
        if (currentPageCustomer && currentPageStaff <= 0) {
            currentPageCustomer = 1;
            currentPageStaff = 1;
        }

        const users = await AdminUserService.getUserCustomer(
            "CUSTOMER",
            currentPageCustomer
        ); //customer pagination

        const staffs = await AdminUserService.getAdminandStaff(
            currentPageStaff
        );

        const totalPagesCustomer =
            await AdminUserService.countTotalUserPagesByRole("CUSTOMER");
        const totalPagesStaff =
            await AdminUserService.countTotalStaffAndAdminPages();

        const roles = await AdminUserService.getAllRoles(); // lấy tất cả role

        const optionRoles = await AdminUserService.getOptionRole();

        const genderOptions = [
            { name: "Nữ", value: "man" },
            { name: "Nam", value: "woman" },
        ];
        return res.render("admin/users/users.ejs", {
            users: users,
            roles: roles,
            staffs: staffs,
            totalPagesCustomer: +totalPagesCustomer,
            totalPagesStaff: +totalPagesStaff,
            pageCustomer: currentPageCustomer,
            pageStaff: currentPageStaff,
            optionRoles: optionRoles,
            genderOptions: genderOptions,
        });
    };
    getViewDetailCustomerAdminPage = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await AdminUserService.getDetailCustomerById(+id);

        return res.render("admin/users/detail_customer.ejs", {
            user: user,
        });
    };

    getViewDetailStaffAdminPage = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await AdminUserService.getDetailCustomerById(+id);
        return res.render("admin/users/detail_staff.ejs", {
            user: user,
        });
    };

    postCreateUser = async (req: Request, res: Response) => {
        const {
            username,
            email,
            phone,
            roleId,
            gender,
            birthday,
            address,
            password,
        } = req.body;
        const file = req.file;
        const avatar = file?.filename ?? null;
        await AdminUserService.handleCreateUser(
            username,
            email,
            phone,
            roleId,
            gender,
            birthday,
            address,
            password,
            avatar
        );
        //success
        return res.redirect("/admin/users");
    };

    postDeleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        await AdminUserService.handleDeleteUser(+id);
        return res.redirect("/admin/users");
    };

    postLockUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleLockUser(+id);

            return res.redirect("/admin/users");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    postUnlockUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await AdminUserService.handleUnlockUser(+id);

            return res.redirect("/admin/users");
        } catch (err) {
            console.error(err);
            res.json({ success: false });
        }
    };

    postUpdateStaff = async (req: Request, res: Response) => {
        const { id, username, email, password, phone, address } = req.body;
        const file = req.file;
        const avatar = file?.filename ?? null;
        await AdminUserService.handleUpdateStaffById(
            id,
            username,
            email,
            password,
            phone,
            address,
            avatar
        );
        return res.redirect(`/admin/user/staff-detail/${id}`);
    };
}

export default new AdminUserController();
