import { EventService } from "@/services/event.service";
import { EventRepository } from "@/repository/event.repository";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

export async function GET({params} : {params : { id: string}}){
    try{
        const {id} = params
        const result = event_service.get_event_schedule(id)
        return NextResponse.json(result, {status:200})
    }catch(error){
        return NextResponse.json(error, {status : 400})
    }
}