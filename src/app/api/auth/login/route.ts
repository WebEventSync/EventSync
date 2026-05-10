import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = await authService.login(
            body.email,
            body.password
        );

        return NextResponse.json(result);

    } catch (e: any) {

        return NextResponse.json(
            { error: e.message },
            { status: 401 }
        );
    }
}