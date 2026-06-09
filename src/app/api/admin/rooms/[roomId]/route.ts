import { NextResponse } from "next/server";
import { RoomRepository } from "@/repository/room.repository";
import { RoomService } from "@/services/room.service";
import corsHeaders from "@/app/api/admin/core_header";

const room_service = new RoomService(new RoomRepository());

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

interface Params {
    params: Promise<{ roomId: string }>;
}

export async function GET(_req: Request, { params }: Params) {
    try {
        const { roomId } = await params;
        const room = await room_service.get_room_by_id(roomId);
        return NextResponse.json(room, { status: 200 , headers: corsHeaders });
    } catch {
        return NextResponse.json({ error: "Salle introuvable" }, { status: 404 , headers: corsHeaders });
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const { roomId } = await params;
        const body = await req.json();
        const updated = await room_service.update_room(roomId, body);
        return NextResponse.json(updated, { status: 200 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 400 , headers: corsHeaders }
        );
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { roomId } = await params;
        await room_service.delete_room(roomId);
        return new NextResponse(null, { status: 204 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 400 , headers: corsHeaders }
        );
    }
}
