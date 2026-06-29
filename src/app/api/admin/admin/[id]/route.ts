import { authService } from "@/services/auth.service";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import corsHeaders from "@/app/api/admin/core_header";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;
        const result = await authService.getAdminById(id);
        return NextResponse.json(result, { status: 200, headers: {
            ...corsHeaders,
        }});
    }catch (e: any) {
        return NextResponse.json(
            { message: e.message },
            { status: 404 , headers: {
                ...corsHeaders,
            }}
        );
    }
}

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;
        const result = await authService.deleteAdmin(id);
        return NextResponse.json(result, { status: 200, headers: {
            ...corsHeaders,
        }});
    }catch (e: any) {
        return NextResponse.json(
            { message: e.message },
            { status: 400 , headers: {
                ...corsHeaders,
            }}
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;
        const body = await request.json();
        const result = await authService.updateAdmin(id, body);
        return NextResponse.json(result, { status: 200, headers: {
            ...corsHeaders,
        }});
    }
    catch (e: any) {
        return NextResponse.json(
            { message: e.message },
            { status: 400 , headers: {
                ...corsHeaders,
            }}
        );
    }
}
