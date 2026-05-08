import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/utils/jwt";

export function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;

    // On cible uniquement /api/admin/*
    const isAdminRoute = pathname.startsWith("/api/admin");

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const user = verifyToken(token);

        // vérifier rôle admin ici plus tard
        return NextResponse.next();

    } catch (err) {
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        );
    }
}



// matcher uniquement admin routes
export const config = {
    matcher: ["/api/admin/:path*"]
};