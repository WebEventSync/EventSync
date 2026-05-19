import { NextResponse } from 'next/server'
import { questionService } from '@/services/question.service'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const { questionId } = await params
  const body = await req.json()
  const visitorId = body.visitorId

  if (!visitorId) {
    return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 })
  }

  try {
    const updated = await questionService.upvote(questionId, visitorId)
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
