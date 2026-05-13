import { NextResponse } from "next/server";
import { SessionSpeakerRepository } from "@/repository/session_speaker.repository";
import { SessionSpeakerService } from "@/services/session_speaker.service";

const session_speaker_service = new SessionSpeakerService(new SessionSpeakerRepository)

export async function GET(req : Request, {params} : {params : { sessionId: string}}) {
    const {sessionId} = await params
    try{
        const result = await session_speaker_service.get_speaker_by_session(sessionId)
        return NextResponse.json(result, {status : 200})
    }catch(error){
        return NextResponse.json({message : error instanceof Error? error.message : String(error)}, {status : 400})
    }
}