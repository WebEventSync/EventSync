import { NextResponse } from "next/server";
import { SessionService } from "@/services/session.service";
import { SessionRepository } from "@/repository/session.repository";

const sessionService = new SessionService(new SessionRepository());

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const session = await sessionService.get_session_by_id(sessionId);
    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : String(error) },
      { status: 404 }
    );
  }
}