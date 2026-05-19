import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/utils/jwt";

export async function GET(req: Request) {
    try {
        const admin = requireAuth(req);

        return NextResponse.json(admin);

    } catch {

        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
}