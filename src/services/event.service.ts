import { Prisma } from "../generated/prisma"
import { EventRepository } from "@/repository/event.repository";

export class EventService{
    constructor( private event_repositrory : EventRepository){}

    async create_event(event : Prisma.EventCreateInput){
        const start = new Date(event.startDate as string)
        const end = new Date(event.endDate as string)
        if (start> end) {
            throw new Error("Start Day may be before End Day")
        }
        return this.event_repositrory.create_event({
            ...event,
            startDate : start,
            endDate : end
        })
    }
    /***********************************************************************************************/
    async put_event(event : Prisma.EventUpdateInput, id : string){
        if(id == null){
            throw new Error(`no id provided`)
        }
        try{
            await this.event_repositrory.get_event_by_id(id)
        }catch(error){
            throw new Error(`event ${id} doesn't exist`)
        }
        return this.event_repositrory.put_event(event, id)
    }
    /***********************************************************************************************/
    async delete_event(id : string){
        if(id == null){
            throw new Error(`no id provided`)
        }
        try{
            await this.event_repositrory.get_event_by_id(id)
        }catch(error){
            throw new Error(`event ${id} doesn't exist`)
        }
        return this.event_repositrory.delete_event(id)
    }
    /***********************************************************************************************/
    async get_all_events(){
        return this.event_repositrory.get_all_events()
    }
    /***********************************************************************************************/
    async get_event_by_id(id : string){
        if(id == null){
            throw new Error(`no id provided`)
        }
        return this.event_repositrory.get_event_by_id(id)
    }
    /***********************************************************************************************/
    async get_event_schedule(id: string){
        if(id == null){
            throw new Error(`no id provided`)
        }
        try{
            this.event_repositrory.get_event_by_id(id)
        }catch(error){
            throw new Error(`event ${id} doesn't exist`)
        }
        return this.event_repositrory.get_event_schedule(id)
    }
}