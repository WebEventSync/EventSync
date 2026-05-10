import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const { questionId } = await params;

    const body = await req.json();
    const visitorId = body.visitorId;

    if (!visitorId) {
        return NextResponse.json(
            { error: "Missing visitorId" },
            { status: 400 }
        );
    }

    try {
        // 1. créer vote (si existe déjà → erreur)
        await prisma.questionVote.create({
            data: {
                questionId,
                visitorId
            }
        });

        // 2. increment upvotes
        const updated = await prisma.question.update({
            where: { id: questionId },
            data: {
                upvotes: { increment: 1 }
            }
        });

        return NextResponse.json(updated);

    } catch (e: any) {
        // Prisma unique constraint violation
        if (e.code === "P2002") {
            return NextResponse.json(
                { error: "Already voted" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}