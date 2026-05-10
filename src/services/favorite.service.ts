import { prisma } from "@/lib/prisma";
import { favoriteRepository } from "@/repository/favorite.repository";

export const favoriteService = {
    getFavorites(visitorId: string) {
        return favoriteRepository.findByVisitor(visitorId);
    },

    async addFavorite(visitorId: string, sessionId: string) {
        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            throw new Error("Session not found");
        }

        return favoriteRepository.create(visitorId, sessionId);
    },

    removeFavorite(visitorId: string, sessionId: string) {
        return favoriteRepository.delete(visitorId, sessionId);
    }
};