import { EventRepository } from "@/repository/event.repository";
import { EventService } from "@/services/event.service";
import { NextResponse } from "next/server";

const event_service = new EventService(new EventRepository)

export async function PUT(request: Request, {params} : {params : { id: string}}) {
    const {id} = await params;
    const event = await request.json();    
    try{
        const result = await event_service.put_event(event, id)
        return NextResponse.json(result, {status: 201})
    }catch (error){ 
        return NextResponse.json(error, {status : 400})
    }
}

export async function DELETE(request: Request,{params} : {params : { id: string}}) {
    const {id} = await params;
    try{
        const result = await event_service.delete_event(id)
        return NextResponse.json(result, {status: 201})
    }catch (error){
        if(error instanceof Error)
            console.log((Error),error.message);
            
        return NextResponse.json(error, {status : 400})
    }
}