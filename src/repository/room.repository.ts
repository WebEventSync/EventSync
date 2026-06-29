import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export class RoomRepository {

  async find_all_rooms() {
    return prisma.room.findMany({
      orderBy: { name: "asc" },
    });
  }

  async find_room_by_id(id: string) {
    return prisma.room.findUnique({
      where: { id },
    });
  }

  async find_sessions_by_room(roomId: string, live?: boolean) {
    const now = new Date();

    return prisma.session.findMany({
      where: {
        roomId,
        ...(live
            ? { startTime: { lte: now }, endTime: { gte: now } }
            : {}),
      },
      include: {
        speakers: {
          include: {
            speaker: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        },
      },
      orderBy: { startTime: "asc" },
    });
  }

  async create_room(data: Prisma.RoomCreateInput) {
    return prisma.room.create({ data });
  }

  async update_room(id: string, data: Prisma.RoomUpdateInput) {
    return prisma.room.update({
      where: { id },
      data,
    });
  }

  async delete_room(id: string) {
    return prisma.room.delete({ where: { id } });
  }

  async count_sessions_by_room(roomId: string) {
    return prisma.session.count({ where: { roomId } });
  }
}