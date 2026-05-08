import { prisma } from "../lib/prisma";
import { questionRepository } from "../repository/question.repository";

export const questionService = {
  getBySession(sessionId: string) {
    return questionRepository.findBySession(sessionId);
  },

  async create(sessionId: string, content: string, authorName?: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const now = new Date();

    const isLive =
        now >= session.startTime &&
        now <= session.endTime;

    if (!isLive) {
      throw new Error("Session is not live");
    }

    return questionRepository.create({
      content,
      authorName,
      sessionId,
    });
  },
};