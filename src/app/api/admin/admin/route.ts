import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import  corsHeaders  from "@/app/api/admin/core_header";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const admin = await authService.register(
            body.name,
            body.email,
            body.password
        );

        return NextResponse.json(admin, {
            status: 201, 
            headers: {
                ...corsHeaders,
            },
        });

    } catch (e: any) {

        return NextResponse.json(
            { error: e.message },
            { status: 400 , headers: {
                ...corsHeaders,
            }}
        );
    }
}

export async function GET(req: Request) {
    try {
        const admins = await authService.getAllAdmins();
        return NextResponse.json(admins, {
            status: 200,
            headers: {
                ...corsHeaders,
            },
        });
    }catch (e: any) {
        return NextResponse.json(
            { error: e.message },
            { status: 400 , headers: {
                ...corsHeaders,
            }}
        );
    }
}