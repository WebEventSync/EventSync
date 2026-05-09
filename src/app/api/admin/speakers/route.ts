import { NextResponse } from "next/server";
import { SpeakerRepository } from "@/repository/speaker.repository";
import { SpeakerService } from "@/services/speaker.service";

const speaker_service = new SpeakerService(new SpeakerRepository());

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, photo, bio, twitter, linkedin, github, website } = body;

        if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'fullName' est obligatoire" },
                { status: 400 }
            );
        }

        const speaker = await speaker_service.create_speaker({
            fullName: fullName.trim(),
            photo: photo ?? null,
            bio: bio ?? null,
            twitter: twitter ?? null,
            linkedin: linkedin ?? null,
            github: github ?? null,
            website: website ?? null,
        });

        return NextResponse.json(speaker, { status: 201 });
    } catch (error) {
        console.error("[POST /api/admin/speakers]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}