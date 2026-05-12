import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

export async function POST(request: Request) {
    try{
        const event = await request.json();
        const result = await event_service.create_event(event)
        return NextResponse.json(result, {status: 201})
    }catch (error){
        return NextResponse.json({message : error instanceof Error? error.message : String(error)}, {status : 400})
    }
}