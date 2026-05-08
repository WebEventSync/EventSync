import { prisma } from "@/lib/prisma";

export const favoriteRepository = {
    findByVisitor(visitorId: string) {
        return prisma.favorite.findMany({
            where: { visitorId },
            include: {
                session: true
            }
        });
    },

    async create(visitorId: string, sessionId: string) {
        return prisma.favorite.create({
            data: {
                visitorId,
                sessionId
            }
        });
    },

    delete(visitorId: string, sessionId: string) {
        return prisma.favorite.delete({
            where: {
                visitorId_sessionId: {
                    visitorId,
                    sessionId
                }
            }
        });
    }
};