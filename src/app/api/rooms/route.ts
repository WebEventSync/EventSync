import { NextResponse } from "next/server";
import { RoomRepository } from "@/repository/room.repository";
import { RoomService } from "@/services/room.service";
import { ok, handleError } from "@/lib/api-helpers";

const room_service = new RoomService(new RoomRepository());

export async function GET(): Promise<NextResponse> {
    try {
        const rooms = await room_service.get_all_rooms();
        return ok(rooms);
    } catch (error) {
        return handleError(error);
    }
}
