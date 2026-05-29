import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // =========================
  // CORS
  // =========================

  response.headers.set(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  response.headers.set(
    "Access-Control-Allow-Credentials",
    "true"
  );

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  // =========================
  // Protection admin routes
  // =========================

  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET
      );

      await jwtVerify(token, secret);

      return response;
    } catch {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};