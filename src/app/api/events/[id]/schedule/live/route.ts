import { EventService } from "@/services/event.service";
import { EventRepository } from "@/repository/event.repository";
import { NextRequest, NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext){
    const { id } = await params;
    try{
        const result = await event_service.get_event_schedule(id)
        return NextResponse.json(result, {status:200})
    }catch(error){
        return NextResponse.json(error, {status : 400})
    }
}