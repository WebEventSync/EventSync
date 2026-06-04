import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const result = await event_service.get_event_by_id(id);
        return NextResponse.json(result, { status: 200, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 404 , headers: corsHeaders }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const event = await request.json();
        const result = await event_service.put_event(event, id);
        return NextResponse.json(result, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error("PUT request failed:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 400 , headers: corsHeaders }
        );
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const result = await event_service.delete_event(id);
        return NextResponse.json(result, { status: 200, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : String(error) },
            { status: 400 , headers: corsHeaders }
        );
    }
}

