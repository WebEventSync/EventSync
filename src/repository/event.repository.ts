import {prisma} from "../lib/prisma.js"
import { Prisma } from "../generated/prisma"

export class EventRepository {
    async create_event(event : Prisma.EventCreateInput){
        return prisma.event.create({ data : event})
    }
    async put_event(event : Prisma.EventUpdateInput, id: string){
        return prisma.event.update({
            where: { id },
            data: { ...event }
        })
    }
    async delete_event(id : string){
        return prisma.event.delete({
            where : {id}
        })
    }
    async get_all_events(){
        return prisma.event.findMany()
    }
    async get_event_by_id(id : string){
        return prisma.event.findUniqueOrThrow({
            where : {id}
        })
    }
    async get_event_schedule(id: string){
        return prisma.event.findUnique({
            where : {id},
            select : {sessions: true}
        })
    }
}

