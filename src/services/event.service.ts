import { Prisma } from "../generated/prisma"
import { EventRepository } from "@/repository/event.repository";
import { AppError } from "@/types";

export class EventService{
    constructor( private event_repositrory : EventRepository){}

    // ─── Validations logiques – dates ─────────────────────────────────────────

    private assert_event_dates(startDate: Date, endDate: Date) {
        if (startDate >= endDate) {
            throw new AppError(
                startDate.getTime() === endDate.getTime()
                    ? "EVENT_START_EQUALS_END"
                    : "EVENT_START_AFTER_END"
            );
        }
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    async create_event(event : Prisma.EventCreateInput){
        const startDate = new Date(event.startDate as string)
        const endDate = new Date(event.endDate as string)

        this.assert_event_dates(startDate, endDate);

        return this.event_repositrory.create_event({
            ...event,
            startDate,
            endDate
        })
    }

    async put_event(event : Prisma.EventUpdateInput, id : string){
        if(!id) throw new AppError("EVENT_NOT_FOUND_FOR_UPDATE");

        const existing = await this.event_repositrory.get_event_by_id(id).catch(() => null);
        if (!existing) throw new AppError("EVENT_NOT_FOUND");

        // Calcul des dates effectives après mise à jour
        const startDate = event.startDate
            ? new Date(event.startDate as string)
            : existing.startDate;
        const endDate = event.endDate
            ? new Date(event.endDate as string)
            : existing.endDate;

        this.assert_event_dates(startDate, endDate);

        return this.event_repositrory.put_event(event, id)
    }

    async delete_event(id : string){
        if(!id) throw new AppError("EVENT_NOT_FOUND_FOR_UPDATE");

        const existing = await this.event_repositrory.get_event_by_id(id).catch(() => null);
        if (!existing) throw new AppError("EVENT_NOT_FOUND");

        return this.event_repositrory.delete_event(id)
    }

    async get_all_events(){
        return this.event_repositrory.get_all_events()
    }

    async get_event_by_id(id : string){
        if(!id) throw new AppError("EVENT_NOT_FOUND");

        const event = await this.event_repositrory.get_event_by_id(id).catch(() => null);
        if (!event) throw new AppError("EVENT_NOT_FOUND");
        return event;
    }

    async get_event_schedule(id: string){
        if(!id) throw new AppError("EVENT_NOT_FOUND");

        const event = await this.event_repositrory.get_event_by_id(id).catch(() => null);
        if (!event) throw new AppError("EVENT_NOT_FOUND");

        return this.event_repositrory.get_event_schedule(id)
    }
}