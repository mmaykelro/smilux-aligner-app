import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/nextAuth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
  }

  return NextResponse.json(session.user, { status: 200 })
}
