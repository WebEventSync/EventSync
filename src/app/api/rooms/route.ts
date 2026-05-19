import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const room = await prisma.room.create({
      data: { name: body.name, capacity: body.capacity || 100 }
    })
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
