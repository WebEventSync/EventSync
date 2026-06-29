import { prisma } from "@/lib/prisma";

export const adminRepository = {

    findAll() {
        return prisma.admin.findMany();
    },

    findById(id: string) {
        return prisma.admin.findUnique({
            where: { id },
            select : {id: true, name: true, email: true}
        });
    },

    delete(id: string) {
        return prisma.admin.delete({
            where: { id }
        });
    },

    update(id: string, data: { name?: string; email?: string; password?: string }) {
        return prisma.admin.update({
            where : {id},
            data
    })},

    findByEmail(email: string) {
        return prisma.admin.findUnique({
            where: { email }
        });
    },

    create(data: {
        name: string;
        email: string;
        password: string;
    }) {
        return prisma.admin.create({
            data
        });
    }

};