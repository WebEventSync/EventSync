import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const admin = await authService.register(
            body.name,
            body.email,
            body.password
        );

        return NextResponse.json(admin, {
            status: 201
        });

    } catch (e: any) {

        return NextResponse.json(
            { error: e.message },
            { status: 400 }
        );
    }
}