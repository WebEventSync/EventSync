import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
    try {
        const events = await event_service.get_all_events();
        return NextResponse.json(events, {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Range": `events 0-${events.length - 1}/${events.length}`,
                "Access-Control-Expose-Headers": "Content-Range",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function POST(request: Request) {
    try {
        const event = await request.json();
        const result = await event_service.create_event(event);
        return NextResponse.json(result, { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 400, headers: corsHeaders }
        );
    }
}
