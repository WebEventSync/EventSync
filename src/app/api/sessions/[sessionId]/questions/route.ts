import { NextResponse } from "next/server";
import { questionService } from "@/services/question.service";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const questions = await questionService.getBySession(sessionId);

  return NextResponse.json(questions);
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();

    const question = await questionService.create(
        sessionId,
        body.content,
        body.authorName
    );

    return NextResponse.json(question, { status: 201 });

  } catch (e: any) {
    if (e.message === "Session not found") {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }

    if (e.message === "Session is not live") {
      return NextResponse.json({ error: e.message }, { status: 403 });
    }

    return NextResponse.json(
        { error: "Internal error" },
        { status: 500 }
    );
  }
}