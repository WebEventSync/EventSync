import { prisma } from "../lib/prisma";
import { questionRepository } from "../repository/question.repository";

export class QuestionService {
  async get_question(id: string) {
      return await this.question_repository.get_question(id)
  }
  async update_session(id: string, body: any) {
      return await this.question_repository.update(id, body)
  }
  constructor(private question_repository: questionRepository){}
  async getBySession(sessionId: string) {
    return await this.question_repository.findBySession(sessionId);
  }

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

    return this.question_repository.create({
      content,
      authorName,
      sessionId,
    });
  }
  async get_questions(){
    return await this.question_repository.get_questions()
  }
  async delete_question(id: string){
    return await this.question_repository.delete_question(id);
  }
};