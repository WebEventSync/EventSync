import { prisma } from "@/lib/prisma";

export const adminRepository = {

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