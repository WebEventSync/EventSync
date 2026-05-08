import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

export async function GET() {
    try{
        const result = await event_service.get_all_events()
        return NextResponse.json(result, {status: 200})
    }catch (error){
        return NextResponse.json(error, {status : 400})
    }
}