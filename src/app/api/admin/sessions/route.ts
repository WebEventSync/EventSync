import { NextRequest, NextResponse } from "next/server";
import { SessionRepository } from "@/repository/session.repository";
import { SessionService } from "@/services/session.service";

const session_service = new SessionService(new SessionRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(){
    try {
        const result = await session_service.get_all_sessions()
        return NextResponse.json(
            result,
            {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Range": `events 0-${result.length - 1}/${result.length}`,
                "Access-Control-Expose-Headers": "Content-Range",
            },
        }
        )
    }catch (err){
        return NextResponse.json(
            { message: err instanceof Error ? err.message : String(err) },
            { status: 500, headers: corsHeaders }
        );
    }
}

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const eventId = searchParams.get("eventId");

//         if (!eventId) {
//             return NextResponse.json(
//                 { error: "Le paramètre 'eventId' est requis" },
//                 { status: 400 , headers: corsHeaders }
//             );
//         }

//         const sessions = await session_service.get_sessions_by_event(eventId, {});
//         return NextResponse.json(sessions, {
//             status: 200,
//             headers: {
//                 "Content-Range": `sessions 0-${sessions.length - 1}/${sessions.length}`,
//                 "Access-Control-Expose-Headers": "Content-Range",
//                 ...corsHeaders
//             },
//         });
//     } catch (error) {
//         return NextResponse.json(
//             { error: error instanceof Error ? error.message : "Erreur interne" },
//             { status: 500 , headers: corsHeaders }
//         );
//     }
// }

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { speakersId, eventId, ...dto } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: "Le champ 'eventId' est obligatoire" },
                { status: 400 , headers: corsHeaders }
            );
        }
        if (!dto.title || !dto.startTime || !dto.endTime || !dto.roomId) {
            return NextResponse.json(
                { error: "Les champs title, startTime, endTime et roomId sont obligatoires" },
                { status: 400 , headers: corsHeaders }
            );
        }

        const session = await session_service.create_session(eventId, dto, speakersId);
        return NextResponse.json(session, { status: 201 , headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/admin/sessions]", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 500 , headers: corsHeaders }
        );
    }
}
