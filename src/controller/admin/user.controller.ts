//controller cua admin
import { Request, Response } from "express";
import { getAllRoles, getAllUsers, getDetailCustomerById, handleCreateUser, handleDeleteUser } from "../../models/admin/user.model";

const getUserAdminPage = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    const roles = await getAllRoles(); // lấy tất cả role

    const statusOptions = [
        { name: "activity", value: "hoat dong" },
        { name: "lock", value: "bi khoa" },
    ];
    return res.render("admin/user/show.ejs", {
        users: users,
        roles: roles,
        statusOptions: statusOptions
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
    return res.render("admin/user/staffDetail.ejs")
}

const postCreateUser = async (req: Request, res: Response) => {
    const { username, email, phone, roleId, status, birthday, address, password } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    await handleCreateUser(username, email, phone, roleId, status, birthday, address, password, avatar)
    //success
    return res.redirect("/admin/user")
}

const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteUser(+id);
    return res.redirect("/admin/user")
}

export { getUserAdminPage, getViewDetailCustomerAdminPage, postCreateUser, postDeleteUser, getViewDetailStaffAdminPage };
