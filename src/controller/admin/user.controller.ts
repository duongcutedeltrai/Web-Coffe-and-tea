//controller cua admin
import { Request, Response } from "express";
import AdminUserService from "../../services/admin/user.service";

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

        const optionRoles = await AdminUserService.getOptionRole();

        const genderOptions = [
            { name: "Nữ", value: "man" },
            { name: "Nam", value: "woman" },
        ];
        return res.render("admin/users/view_customer.ejs", {
            customers: customers,
            roles: roles,
            totalPagesCustomer: +totalPagesCustomer,
            pageCustomer: currentPageCustomer,
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
    // end user phan customer


    // user phan admin 
    getAdminStaffPage = async (req: Request, res: Response) => {
        const { pageStaff } = req.query;

        let currentPageStaffs = pageStaff ? +pageStaff : 1;
        if (currentPageStaffs <= 0) {
            currentPageStaffs = 1;

        }

        const staffs = await AdminUserService.getAdminandStaff(currentPageStaffs); //customer pagination


        const totalPageStaffs =
            await AdminUserService.countTotalStaffAndAdminPages();


        const roles = await AdminUserService.getAllRoles(); // lấy tất cả role

        const optionRoles = await AdminUserService.getOptionRole();

        const genderOptions = [
            { name: "Nữ", value: "man" },
            { name: "Nam", value: "woman" },
        ];
        return res.render("admin/users/view_staff.ejs", {
            staffs: staffs,
            roles: roles,
            totalPageStaffs: +totalPageStaffs,
            pageStaff: currentPageStaffs,
            optionRoles: optionRoles,
            genderOptions: genderOptions,
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
        return res.redirect("/admin/staff");
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

    // end user phan admin 







}

export default new AdminUserController();