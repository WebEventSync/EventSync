import { prisma } from '@/lib/prisma'
import { questionRepository } from '@/repository/question.repository'

export const questionService = {
  getBySession(sessionId: string) {
    return questionRepository.findBySession(sessionId)
  },

  async create(sessionId: string, content: string, authorName?: string) {
    const session = await prisma.session.findUnique({ where: { id: sessionId } })
    if (!session) throw new Error('Session not found')

    const now = new Date()
    if (now < session.startTime || now > session.endTime) throw new Error('Session is not live')

    return questionRepository.create({ content, authorName, sessionId })
  },

  async upvote(questionId: string, visitorId: string) {
    return questionRepository.upvote(questionId, visitorId)
  },
}
