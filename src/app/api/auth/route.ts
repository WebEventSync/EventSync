import { NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe obligatoires' }, { status: 400 })
    }
    const result = await authService.login(email, password)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    const status = message === 'Invalid credentials' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
