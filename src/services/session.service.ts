import { SessionRepository } from "@/repository/session.repository";
import { AppError, CreateSessionDto, SessionFilters, UpdateSessionDto } from "@/types";
import { prisma } from "@/lib/prisma";

export class SessionService {
  constructor(private session_repository: SessionRepository) {}

  // ─── Assertions privées – existence ───────────────────────────────────────

  private async assert_event_exists(eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError("EVENT_NOT_FOUND");
    return event;
  }

  private async assert_room_exists(roomId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError("ROOM_NOT_FOUND");
    return room;
  }

  private async assert_speaker_exists(speakerId: string) {
    const speaker = await prisma.speaker.findUnique({ where: { id: speakerId } });
    if (!speaker) throw new AppError("SPEAKER_NOT_FOUND");
  }

  // ─── Validations logiques – dates ─────────────────────────────────────────

  /**
   * Vérifie que startTime < endTime.
   */
  private assert_session_dates(startTime: Date, endTime: Date) {
    if (startTime >= endTime) {
      throw new AppError(
        startTime.getTime() === endTime.getTime()
          ? "SESSION_START_EQUALS_END"
          : "SESSION_START_AFTER_END"
      );
    }
  }

  /**
   * Vérifie que la session est bien contenue dans les dates de l'event parent.
   */
  private assert_session_within_event(
    startTime: Date,
    endTime: Date,
    event: { startDate: Date; endDate: Date }
  ) {
    if (startTime < event.startDate || endTime > event.endDate) {
      throw new AppError("SESSION_OUTSIDE_EVENT_BOUNDS");
    }
  }

  /**
   * Vérifie qu'aucune autre session dans la même salle et le même event
   * ne chevauche le créneau [startTime, endTime].
   * Optionnellement exclut une session existante (pour les mises à jour).
   */
  private async assert_no_room_overlap(
    eventId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
    excludeSessionId?: string
  ) {
    const overlapping = await prisma.session.findFirst({
      where: {
        eventId,
        roomId,
        id: excludeSessionId ? { not: excludeSessionId } : undefined,
        // Chevauchement : la session existante commence avant la fin ET finit après le début
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlapping) {
      throw new AppError("SESSION_ROOM_OVERLAP");
    }
  }

  // ─── PUBLIC ────────────────────────────────────────────────────────────────

  async get_all_sessions() {
    return await this.session_repository.get_all_sessions();
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

  async create_session(eventId: string, dto: CreateSessionDto) {
    const event = await this.assert_event_exists(eventId);
    await this.assert_room_exists(dto.roomId);

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // 1. startTime doit être strictement avant endTime
    this.assert_session_dates(startTime, endTime);

    // 2. La session doit être dans les bornes de l'event
    this.assert_session_within_event(startTime, endTime, event);

    // 3. Aucun chevauchement dans la même salle pour le même event
    await this.assert_no_room_overlap(eventId, dto.roomId, startTime, endTime);

    return this.session_repository.create_session({
      title: dto.title,
      description: dto.description || "",
      startTime,
      endTime,
      room: { connect: { id: dto.roomId } },
      event: { connect: { id: eventId } },
      ...(dto.speakerIds?.length && {
        speakers: {
          create: dto.speakerIds.map((speakerId) => ({
            speaker: { connect: { id: speakerId } },
          })),
        },
      }),
    });
  }

  async update_session(id: string, dto: UpdateSessionDto) {
    const session = await this.session_repository.find_session_by_id(id);
    if (!session) throw new AppError("SESSION_NOT_FOUND");

    if (dto.roomId) await this.assert_room_exists(dto.roomId);

    // Calcul des dates effectives après mise à jour (en tenant compte des valeurs existantes)
    const startTime = dto.startTime ? new Date(dto.startTime) : session.startTime;
    const endTime = dto.endTime ? new Date(dto.endTime) : session.endTime;

    // 1. startTime doit être strictement avant endTime
    this.assert_session_dates(startTime, endTime);

    // 2. La session doit rester dans les bornes de l'event
    const targetEventId = dto.eventId ?? session.eventId;
    const event = await this.assert_event_exists(targetEventId);
    this.assert_session_within_event(startTime, endTime, event);

    // 3. Aucun chevauchement dans la même salle (en excluant la session courante)
    const targetRoomId = dto.roomId ?? session.roomId;
    await this.assert_no_room_overlap(targetEventId, targetRoomId, startTime, endTime, id);

    return this.session_repository.update_session(id, {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.startTime ? { startTime } : {}),
      ...(dto.endTime ? { endTime } : {}),
      ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
      ...(dto.roomId ? { room: { connect: { id: dto.roomId } } } : {}),
      ...(dto.eventId ? { event: { connect: { id: dto.eventId } } } : {}),
      ...(dto.speakerIds !== undefined && {
        speakers: {
          deleteMany: {},
          create: dto.speakerIds.map((speakerId) => ({
            speaker: { connect: { id: speakerId } },
          })),
        },
      }),
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

  async get_live_sessions() {
    return this.session_repository.get_live_sessions();
  }
}