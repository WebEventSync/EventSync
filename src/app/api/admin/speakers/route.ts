import { NextResponse } from "next/server";
import { SpeakerRepository } from "@/repository/speaker.repository";
import { SpeakerService } from "@/services/speaker.service";

const speaker_service = new SpeakerService(new SpeakerRepository());

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, biography, links } = body;

        if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'firstName' est obligatoire" },
                { status: 400 }
            );
        }

        if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
            return NextResponse.json(
                { error: "Le champ 'lastName' est obligatoire" },
                { status: 400 }
            );
        }

        const speaker = await speaker_service.create_speaker({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            biography: biography ?? null,
            links: links ?? [],
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