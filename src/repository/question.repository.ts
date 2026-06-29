import { prisma } from "../lib/prisma";

export class questionRepository {
  async get_question(id: string) {
    return prisma.question.findFirstOrThrow({where: {id}})
  }
  async update(id: string, body: any) {
    return prisma.question.update({where: {id}, data:body})
  }
  async delete_question(id: string) {
    return prisma.question.delete(
      {where: {id}}
    )
  }
  async get_questions() {
    return prisma.question.findMany()
  }
  async findBySession(sessionId: string) {
    return prisma.question.findMany({
      where: { sessionId },
      orderBy: { upvotes: "desc" },
    });
  }
  
  async create(data: {
    content: string;
    authorName?: string;
    sessionId: string;
  }) {
    return prisma.question.create({ data });
  }
};