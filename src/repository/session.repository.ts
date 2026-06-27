import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

const SESSION_INCLUDE = {
  room: { select: { id: true, name: true } },
  speakers: { include: { speaker: { select: { id: true, firstName: true, lastName: true, photo: true, biography: true } } } },
} satisfies Prisma.SessionInclude;

export class SessionRepository {

  async find_sessions_by_event(eventId: string, filters: { live?: boolean; roomId?: string }) {
    const now = new Date();

    return prisma.session.findMany({
      where: {
        eventId,
        ...(filters.roomId ? { roomId: filters.roomId } : {}),
        ...(filters.live
          ? { startTime: { lte: now }, endTime: { gte: now } }
          : {}),
      },
      include: SESSION_INCLUDE,
      orderBy: { startTime: "asc" },
    });
  }

  async find_all_sessions() {
    return prisma.session.findMany({
      include: SESSION_INCLUDE,
      orderBy: { startTime: "asc" },
    });
  }

  async find_session_by_id(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        ...SESSION_INCLUDE,
        questions: { orderBy: { upvotes: "desc" } },
      },
    });
  }

  async create_session(data: Prisma.SessionCreateInput) {
    return prisma.session.create({
      data
    });
  }

  async update_session(id: string, data: Prisma.SessionUpdateInput) {
    return prisma.session.update({
      where: { id },
      data,
      include: SESSION_INCLUDE,
    });
  }

  async delete_session(id: string) {
    return prisma.session.delete({ where: { id } });
  }

  async find_session_with_speakers(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: { speakers: true },
    });
  }

  async add_speaker_to_session(sessionId: string, speakerId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { speakers: { create: { speakerId } } },
      include: SESSION_INCLUDE,
    });
  }

  async remove_speaker_from_session(sessionId: string, speakerId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { speakers: { disconnect: { id: speakerId } } },
      include: SESSION_INCLUDE,
    });
  }
}