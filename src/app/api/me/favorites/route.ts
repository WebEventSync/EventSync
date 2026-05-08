import { NextResponse } from "next/server";
import { favoriteService } from "@/services/favorite.service";

export async function GET(req: Request) {
    const visitorId = req.headers.get("x-visitor-id");

    if (!visitorId) {
        return NextResponse.json(
            { error: "Missing visitorId" },
            { status: 400 }
        );
    }

    const favorites = await favoriteService.getFavorites(visitorId);

    return NextResponse.json(favorites);
}