import { NextRequest, NextResponse } from "next/server";
import corsHeaders from "@/app/api/admin/core_header";
import { QuestionService } from "@/services/question.service";
import { QuestionRepository } from "@/repository/question.repository";

const question_service = new QuestionService(new QuestionRepository());

interface Params {
    params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET({params} : Params){
    try {
        const { id } = await params;
        const session = await question_service.get_question(id);
        return NextResponse.json(session, { status: 200 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 404 , headers: corsHeaders }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: Params)
{
    try {
        const { id } = await params;
        await question_service.delete_question(id);
        return new NextResponse(null, { status: 204 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 500 , headers: corsHeaders }
        );
    }
}

export async function PUT(_req: NextRequest, { params }: Params){
    try {
        const { id } = await params;
        const body = await _req.json();
        const updated = await question_service.update_session(id, body);
        return NextResponse.json(updated, { status: 200 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur interne" },
            { status: 400 , headers: corsHeaders }
        );
    }
}