//controller cua admin
import { Request, Response } from "express";
import { countTotalStaffAndAdminPages, countTotalUserPagesByRole, getAdminandStaff, getAllRoles, getDetailCustomerById, getOptionRole, getUserCustomer, handleCreateUser, handleDeleteUser, handleLockUser, handleUnlockUser, handleUpdateStaffById } from "../../models/admin/user.model";


const getUserAdminPage = async (req: Request, res: Response) => {
    const { pageCustomer, pageStaff } = req.query;

    let currentPageCustomer = pageCustomer ? +pageCustomer : 1;
    let currentPageStaff = pageStaff ? +pageStaff : 1;
    if (currentPageCustomer && currentPageStaff <= 0) {
        currentPageCustomer = 1;
        currentPageStaff = 1;
    }

    const users = await getUserCustomer("CUSTOMER", currentPageCustomer); //customer pagination

    const staffs = await getAdminandStaff(currentPageStaff);

    const totalPagesCustomer = await countTotalUserPagesByRole("CUSTOMER");
    const totalPagesStaff = await countTotalStaffAndAdminPages();


    const roles = await getAllRoles(); // lấy tất cả role

    const optionRoles = await getOptionRole();

    const genderOptions = [
        { name: "Nữ", value: "man" },
        { name: "Nam", value: "woman" },
    ];
    return res.render("admin/user/show.ejs", {
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
const getViewDetailCustomerAdminPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getDetailCustomerById(+id);

    return res.render("admin/user/customerDetail.ejs", {
        user: user
    })
}

const getViewDetailStaffAdminPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getDetailCustomerById(+id);
    return res.render("admin/user/staffDetail.ejs", {
        user: user
    })
}

const postCreateUser = async (req: Request, res: Response) => {
    const { username, email, phone, roleId, gender, birthday, address, password } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    await handleCreateUser(username, email, phone, roleId, gender, birthday, address, password, avatar)
    //success
    return res.redirect("/admin/user")
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(+id);
    return res.redirect("/admin/user")
}

const postLockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await handleLockUser(+id);

        return res.redirect("/admin/user")
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
};

const postUnlockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await handleUnlockUser(+id);

        return res.redirect("/admin/user")
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
};

const postUpdateStaff = async (req: Request, res: Response) => {
    const { id, username, email, password, phone, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    await handleUpdateStaffById(id, username, email, password, phone, address, avatar);
    return res.redirect(`/admin/user/staff-detail/${id}`);
}


export { getUserAdminPage, getViewDetailCustomerAdminPage, postCreateUser, postDeleteUser, getViewDetailStaffAdminPage, postLockUser, postUnlockUser, postUpdateStaff };
