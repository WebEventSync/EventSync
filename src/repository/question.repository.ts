import { prisma } from '@/lib/prisma'

export const questionRepository = {
  findBySession(sessionId: string) {
    return prisma.question.findMany({
      where: { sessionId },
      orderBy: { upvotes: 'desc' },
    })
  },

  create(data: { content: string; authorName?: string; sessionId: string }) {
    return prisma.question.create({ data })
  },

  async upvote(questionId: string, visitorId: string) {
    await prisma.questionVote.create({ data: { questionId, visitorId } })
    return prisma.question.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    })
  },
}
