import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/utils/jwt";

export async function proxy(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const token = authHeader.substring(7);

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/admin/:path*"],
};