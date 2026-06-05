import { SessionRepository } from "@/repository/session.repository";
import { AppError, CreateSessionDto, SessionFilters, UpdateSessionDto } from "@/types";
import { prisma } from "@/lib/prisma";

export class SessionService {
  constructor(private session_repository: SessionRepository) {}

  // ─── Assertions privées ────────────────────────────────────────────────────

  private async assert_event_exists(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("EVENT_NOT_FOUND");
  }

  private async assert_room_exists(roomId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError("ROOM_NOT_FOUND");
  }

  private async assert_speaker_exists(speakerId: string) {
    const speaker = await prisma.speaker.findUnique({ where: { id: speakerId } });
    if (!speaker) throw new AppError("SPEAKER_NOT_FOUND");
  }

  // ─── PUBLIC ────────────────────────────────────────────────────────────────

  async get_all_sessions(){
    return await this.session_repository.get_all_sessions()
  }

  async get_sessions_by_event(eventId: string, filters: SessionFilters) {
    await this.assert_event_exists(eventId);
    return this.session_repository.find_sessions_by_event(eventId, filters);
  }

  async get_session_by_id(id: string) {
    const session = await this.session_repository.find_session_by_id(id);
    if (!session) throw new AppError("SESSION_NOT_FOUND");
    return session;
  }

  // ─── ADMIN ────────────────────────────────────────────────────────────────

  async create_session(eventId: string, dto: CreateSessionDto, speakersId: string[]) {
    await this.assert_event_exists(eventId);
    await this.assert_room_exists(dto.roomId);

    return this.session_repository.create_session({
      title: dto.title,
      description: dto.description || "",
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),

      room: {
        connect: {
          id: dto.roomId,
        },
      },

      event: {
        connect: {
          id: eventId,
        },
      },

      ...(dto.speakerIds?.length && {
        speakers: {
          create: dto.speakerIds.map((speakerId) => ({
            speaker: {
              connect: {
                id: speakerId,
              },
            },
          })),
        },
      }),
    });
  }

  async update_session(id: string, dto: UpdateSessionDto) {
    const session = await this.session_repository.find_session_by_id(id);
    if (!session) throw new AppError("SESSION_NOT_FOUND");

    if (dto.roomId) await this.assert_room_exists(dto.roomId);

    return this.session_repository.update_session(id, {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.startTime ? { startTime: new Date(dto.startTime) } : {}),
      ...(dto.endTime ? { endTime: new Date(dto.endTime) } : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
      ...(dto.roomId ? { room: { connect: { id: dto.roomId } } } : {}),
      ...(dto.eventId ? {event: {connect: { id: dto.eventId} } } : {}),
      ...(dto.speakerIds?.length && {
        speakers: {
          create: dto.speakerIds.map((speakerId) => ({
            speaker: {
              connect: {
                id: speakerId,
              },
            },
          })),
        },
      })
    });
  }

  async delete_session(id: string) {
    const session = await this.session_repository.find_session_by_id(id);
    if (!session) throw new AppError("SESSION_NOT_FOUND");
    return this.session_repository.delete_session(id);
  }

  async add_speaker_to_session(sessionId: string, speakerId: string) {
    const session = await this.session_repository.find_session_by_id(sessionId);
    if (!session) throw new AppError("SESSION_NOT_FOUND");

    await this.assert_speaker_exists(speakerId);

    return this.session_repository.add_speaker_to_session(sessionId, speakerId);
  }

  async remove_speaker_from_session(sessionId: string, speakerId: string) {
    const session = await this.session_repository.find_session_with_speakers(sessionId);
    if (!session) throw new AppError("SESSION_NOT_FOUND");
    if (session.speakers.length <= 1) throw new AppError("SESSION_NEEDS_ONE_SPEAKER");

    return this.session_repository.remove_speaker_from_session(sessionId, speakerId);
  }
}