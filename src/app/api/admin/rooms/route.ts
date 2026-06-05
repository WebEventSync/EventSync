import { NextResponse } from "next/server";
import { RoomRepository } from "@/repository/room.repository";
import { RoomService } from "@/services/room.service";

const room_service = new RoomService(new RoomRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
    try {
        const rooms = await room_service.get_all_rooms();
        return NextResponse.json(rooms, {
            status: 200,
            headers: {
                "Content-Range": `rooms 0-${rooms.length - 1}/${rooms.length}`,
                "Access-Control-Expose-Headers": "Content-Range",
                ...corsHeaders
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 , headers: corsHeaders }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, capacity } = body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'name' est obligatoire" },
                { status: 400 , headers: corsHeaders }
            );
        }

        const room = await room_service.create_room({ name: name.trim(), capacity: capacity });        
        return NextResponse.json(room, { status: 201 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 500, headers: corsHeaders }
        );
    }
}
