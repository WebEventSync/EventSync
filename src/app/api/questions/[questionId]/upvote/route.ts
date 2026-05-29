import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const { questionId } = await params;
    const { visitorId } = await req.json();

    if (!visitorId) {
        return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
    }

    try {
        const existingVote = await prisma.questionVote.findUnique({
            where: {
                questionId_visitorId: {
                    questionId,
                    visitorId
                }
            }
        });

        if (existingVote) {
            // === RETIRER le vote ===
            await prisma.questionVote.delete({
                where: { id: existingVote.id }
            });

            await prisma.question.update({
                where: { id: questionId },
                data: { upvotes: { decrement: 1 } }
            });

            return NextResponse.json({ message: "Vote removed", action: "decrement" });
        } else {
            // === AJOUTER le vote ===
            await prisma.questionVote.create({
                data: { questionId, visitorId }
            });

            await prisma.question.update({
                where: { id: questionId },
                data: { upvotes: { increment: 1 } }
            });

            return NextResponse.json({ message: "Vote added", action: "increment" });
        }
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}