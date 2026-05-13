import { Prisma } from "@/generated/prisma";
import { SessionSpeakerRepository } from "@/repository/session_speaker.repository";

export class SessionSpeakerService{
    constructor( private session_speaker_repository : SessionSpeakerRepository){}

    async get_speaker_by_session(session_id: string){
        return this.session_speaker_repository.get_speaker_by_session(session_id)
    }
}