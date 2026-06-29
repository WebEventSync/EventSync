import { NextRequest, NextResponse } from "next/server";
import { questionRepository } from "@/repository/question.repository";
import { QuestionService } from "@/services/question.service";
import corsHeaders from "@/app/api/admin/core_header";

const question_repository = new questionRepository();
const question_service = new QuestionService(question_repository);

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(_req : NextRequest)
{
    try {
        const questions = await question_service.get_questions();
        return NextResponse.json(questions, { status: 200 , headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500, headers: corsHeaders });
    }
}