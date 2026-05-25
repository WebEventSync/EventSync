import { NextRequest, NextResponse } from "next/server";
import { RoomRepository } from "@/repository/room.repository";
import { RoomService } from "@/services/room.service";
import { ok, handleError } from "@/lib/api-helpers";

const room_service = new RoomService(new RoomRepository());

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const room = await room_service.get_room_by_id(id);
        return ok(room);
    } catch (error) {
        return handleError(error);
    }
}
