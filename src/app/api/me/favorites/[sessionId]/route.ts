import { NextResponse } from "next/server";
import { favoriteService } from "@/services/favorite.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const visitorId = req.headers.get("x-visitor-id");

        if (!visitorId) {
            return NextResponse.json(
                { error: "Missing visitorId" },
                { status: 400 }
            );
        }

        const { sessionId } = await params;

        const favorite = await favoriteService.addFavorite(
            visitorId,
            sessionId
        );

        return NextResponse.json(favorite, { status: 201 });

    } catch (e: any) {

        if (e.code === "P2002") {
            return NextResponse.json(
                { error: "Already favorite" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: e.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const visitorId = req.headers.get("x-visitor-id");

    if (!visitorId) {
        return NextResponse.json(
            { error: "Missing visitorId" },
            { status: 400 }
        );
    }

    const { sessionId } = await params;

    await favoriteService.removeFavorite(visitorId, sessionId);

    return new Response(null, { status: 204 });
}