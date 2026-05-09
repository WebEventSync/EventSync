import { NextResponse } from "next/server";
import { SpeakerRepository } from "@/repository/speaker.repository";
import { SpeakerService } from "@/services/speaker.service";

const speaker_service = new SpeakerService(new SpeakerRepository());

interface Params {
    params: Promise<{ speakerId: string }>
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const existing = await speaker_service.get_speaker_by_id((await params).speakerId);

        if (!existing) {
            return NextResponse.json(
                { error: "Intervenant introuvable" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { fullName, photo, bio, twitter, linkedin, github, website } = body;

        if (fullName !== undefined && (typeof fullName !== "string" || fullName.trim() === "")) {
            return NextResponse.json(
                { error: "Le champ 'fullName' ne peut pas être vide" },
                { status: 400 }
            );
        }

        const updated = await speaker_service.put_speaker(
            {
                fullName: fullName?.trim(),
                photo: photo ?? undefined,
                bio: bio ?? undefined,
                twitter: twitter ?? undefined,
                linkedin: linkedin ?? undefined,
                github: github ?? undefined,
                website: website ?? undefined,
            },
            (await params).speakerId
        );

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("[PUT /api/admin/speakers/:speakerId]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const existing = await speaker_service.get_speaker_by_id((await params).speakerId);

        if (!existing) {
            return NextResponse.json(
                { error: "Intervenant introuvable" },
                { status: 404 }
            );
        }

        await speaker_service.delete_speaker((await params).speakerId);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[DELETE /api/admin/speakers/:speakerId]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}