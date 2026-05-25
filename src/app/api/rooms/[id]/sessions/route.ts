import { NextRequest, NextResponse } from "next/server";
import { RoomRepository } from "@/repository/room.repository";
import { RoomService } from "@/services/room.service";
import { ok, handleError } from "@/lib/api-helpers";

const room_service = new RoomService(new RoomRepository());

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const live = req.nextUrl.searchParams.get("live") === "true";
        const sessions = await room_service.get_sessions_by_room(id, live);
        return ok(sessions);
    } catch (error) {
        return handleError(error);
    }
}
