import { NextResponse } from "next/server";
import { SpeakerRepository } from "@/repository/speaker.repository";
import { SpeakerService } from "@/services/speaker.service";

const speaker_service = new SpeakerService(new SpeakerRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

interface Params {
    params: Promise<{ speakerId: string }>;
}

export async function GET(_req: Request, { params }: Params) {
    try {
        const { speakerId } = await params;
        const speaker = await speaker_service.get_speaker_by_id(speakerId);
        if (!speaker) {
            return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404, headers: corsHeaders });
        }
        return NextResponse.json(speaker, { status: 200, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500, headers: corsHeaders });
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const { speakerId } = await params;
        const existing = await speaker_service.get_speaker_by_id(speakerId);
        if (!existing) {
            return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404, headers: corsHeaders });
        }

        const body = await req.json();
        const { firstName, lastName, photo, biography } = body;

        const updated = await speaker_service.put_speaker(
            { firstName, lastName, photo, biography },
            speakerId
        );

        return NextResponse.json(updated, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error("[PUT /api/admin/speakers/:speakerId]", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { speakerId } = await params;
        const existing = await speaker_service.get_speaker_by_id(speakerId);
        if (!existing) {
            return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404, headers: corsHeaders });
        }
        await speaker_service.delete_speaker(speakerId);
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    } catch (error) {
        console.error("[DELETE /api/admin/speakers/:speakerId]", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500, headers: corsHeaders });
    }
}
