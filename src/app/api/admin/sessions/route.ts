import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/repository/session.repository";
import { SessionService } from "@/services/session.service";
import { ok, handleError } from "@/lib/api-helpers";

const session_service = new SessionService(new SessionRepository());

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { eventId, speakersId, ...dto } = body;
        const session = await session_service.create_session(eventId, dto, speakersId ?? []);
        return ok(session);
    } catch (error) {
        return handleError(error);
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const eventId = req.nextUrl.searchParams.get("eventId");
        let sessions;
        if (eventId) {
            sessions = await session_service.get_sessions_by_event(eventId, {});
        } else {
            sessions = await session_service.get_all_sessions();
        }
        return ok(sessions);
    } catch (error) {
        return handleError(error);
    }
}