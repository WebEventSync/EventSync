import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const payload = await jwtVerify(token, secret);

    return NextResponse.json({
      authenticated: true,
      user: payload.payload,
    });
  } catch {
    return NextResponse.json(
      { error: "Token invalide" },
      { status: 401 }
    );
  }
}