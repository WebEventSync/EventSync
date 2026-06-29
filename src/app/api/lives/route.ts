import { SessionRepository } from "@/repository/session.repository";
import { SessionService } from "@/services/session.service";
import { NextResponse } from "next/server";

const session_service = new SessionService(new SessionRepository)

export async function GET() {

    const live_sessions = await session_service.get_live_sessions()

    return NextResponse.json(live_sessions);
}