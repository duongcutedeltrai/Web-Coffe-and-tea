import { prisma } from "../../config/client";


const getAllUsers = async () => {
    const viewUser = await prisma.users.findMany({
        include: {
            roles: true,
            orders: true
        }
    });

    return viewUser;
}

const getAllRoles = async () => {
    const roles = await prisma.roles.findMany();
    return roles;
}


const handleCreateUser = async (
    username: string, email: string, phone: string, roleId: number, status: string, birthday: string, address: string, password: string, avatar: string
) => {
    try {
        const newUser = await prisma.users.create({
            data: {
                username: username,
                email: email,
                phone: phone,
                status: status,
                birthday: new Date(birthday),
                address: address,
                password: password,
                avatar: avatar,
                roles: {
                    connect: {
                        role_id: +roleId
                    }
                },

            },
            include: {
                roles: true
            }

        })

        return newUser

    } catch (err) {
        throw new Error("email da ton tai")
    }
}

const handleDeleteUser = async (id: number) => {
    return await prisma.users.delete({
        where: {
            user_id: id
        }
    })
}

const getDetailCustomerById = async (id: number) => {
    const viewDetail = prisma.users.findUnique({
        where: {
            user_id: id
        }
    })
    return viewDetail
}


export { getAllUsers, handleCreateUser, getAllRoles, handleDeleteUser, getDetailCustomerById }