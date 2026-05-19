import { NextResponse } from 'next/server'
import { RoomService } from '@/services/room.service'
import { RoomRepository } from '@/repository/room.repository'

const roomService = new RoomService(new RoomRepository())

export async function GET() {
  try {
    const rooms = await roomService.get_all_rooms()
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const room = await roomService.create_room({ name: body.name })
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 400 })
  }
}
