import { NextResponse } from 'next/server'
import { SessionService } from '@/services/session.service'
import { SessionRepository } from '@/repository/session.repository'

const sessionService = new SessionService(new SessionRepository())

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const dto = await req.json()
    const session = await sessionService.update_session(sessionId, dto)
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    await sessionService.delete_session(sessionId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}
