import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/repository/session.repository";
import { SessionService } from "@/services/session.service";
import { ok, handleError } from "@/lib/api-helpers";

const session_service = new SessionService(new SessionRepository());

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const session = await session_service.get_session_by_id(id);
    return ok(session);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await req.json();
    const session = await session_service.update_session(id, body);
    return ok(session);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const session = await session_service.delete_session(id);
    return ok(session);
  } catch (error) {
    return handleError(error);
  }
}
