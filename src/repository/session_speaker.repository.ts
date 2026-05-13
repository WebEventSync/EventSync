import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'

export class SessionSpeakerRepository{
    async get_speaker_by_session(sessionId: string){
        return prisma.sessionSpeaker.findMany({where : {sessionId}, select : {speaker: true}})
    }
}