import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/repository/session.repository";
import { SessionService } from "@/services/session.service";
import corsHeaders from "@/app/api/admin/core_header";

const session_service = new SessionService(new SessionRepository());

interface Params {
    params: Promise<{ sessionId: string }>;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { sessionId } = await params;
        const session = await session_service.get_session_by_id(sessionId);
        return NextResponse.json(session, { status: 200 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 404 , headers: corsHeaders }
        );
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { sessionId } = await params;
        const body = await req.json();
        const updated = await session_service.update_session(sessionId, body);
        return NextResponse.json(updated, { status: 200 , headers: corsHeaders });
    } catch (error) {
        console.error("[PUT /api/admin/sessions/:sessionId]", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 400 , headers: corsHeaders }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { sessionId } = await params;
        await session_service.delete_session(sessionId);
        return new NextResponse(null, { status: 204 , headers: corsHeaders });
    } catch (error) {
        console.error("[DELETE /api/admin/sessions/:sessionId]", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 500 , headers: corsHeaders }
        );
    }
}
