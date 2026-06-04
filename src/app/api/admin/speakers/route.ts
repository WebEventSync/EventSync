import { NextResponse } from "next/server";
import { SpeakerRepository } from "@/repository/speaker.repository";
import { SpeakerService } from "@/services/speaker.service";

const speaker_service = new SpeakerService(new SpeakerRepository());

import corsHeaders from "@/app/api/admin/core_header";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
    try {
        const speakers = await speaker_service.get_all_speakers();
        return NextResponse.json(speakers, {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Range": `speakers 0-${speakers.length - 1}/${speakers.length}`,
                "Access-Control-Expose-Headers": "Content-Range",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 , headers: corsHeaders }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, biography, photo, links } = body;

        if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'firstName' est obligatoire" },
                { status: 400 , headers: corsHeaders }
            );
        }
        if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'lastName' est obligatoire" },
                { status: 400 , headers: corsHeaders }
            );
        }

        const speaker = await speaker_service.create_speaker({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            biography: biography ?? null,
            photo: photo ?? null,
            links: links ?? [],
        });

        return NextResponse.json(speaker, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/admin/speakers]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 , headers: corsHeaders }
        );
    }
}
