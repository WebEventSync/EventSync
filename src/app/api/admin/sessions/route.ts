import { NextResponse } from 'next/server'
import { SessionService } from '@/services/session.service'
import { SessionRepository } from '@/repository/session.repository'

const sessionService = new SessionService(new SessionRepository())

export async function POST(req: Request) {
  const body = await req.json()
  const { eventId, ...dto } = body
  console.log(eventId, dto);
  
  try {
    const session = await sessionService.create_session(eventId, dto)
    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    if(error instanceof Error)
    console.log((Error),error.message);
    
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}
