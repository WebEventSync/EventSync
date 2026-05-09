import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { log } from "console";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

export async function GET(req : Request, {params} : {params : { id: string}}) {
    const {id} = await params
    try{
        const result = await event_service.get_event_by_id(id)
        return NextResponse.json(result, {status: 200})
    }catch (error){
        return NextResponse.json(error, {status : 400})
    }
}