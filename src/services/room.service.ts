
import { RoomRepository } from "@/repository/room.repository";
import { AppError, CreateRoomDto, UpdateRoomDto } from "@//types";

export class RoomService {
  constructor(private room_repository: RoomRepository) {}

  async get_all_rooms() {
    return this.room_repository.find_all_rooms();
  }

  async get_room_by_id(id: string) {
    const room = await this.room_repository.find_room_by_id(id);
    if (!room) throw new AppError("ROOM_NOT_FOUND");
    return room;
  }

  async get_sessions_by_room(roomId: string, live?: boolean) {
    await this.get_room_by_id(roomId); // vérifie existence
    return this.room_repository.find_sessions_by_room(roomId, live);
  }

  async create_room(dto: CreateRoomDto) {
    return this.room_repository.create_room({ name: dto.name.trim() });
  }

  async update_room(id: string, dto: UpdateRoomDto) {
    await this.get_room_by_id(id); // vérifie existence

    return this.room_repository.update_room(id, {
      ...(dto.name ? { name: dto.name.trim() } : {}),
    });
  }

  async delete_room(id: string) {
    await this.get_room_by_id(id); // vérifie existence

    const sessionCount = await this.room_repository.count_sessions_by_room(id);
    if (sessionCount > 0) throw new AppError("ROOM_HAS_SESSIONS");

    return this.room_repository.delete_room(id);
  }
}