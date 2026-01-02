import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtDecode } from 'jwt-decode'
import { COOKIE_TOKEN } from '@/constants/auth'

export async function proxy(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.SECRET })) as any
  const apiToken = (await cookies()).get(COOKIE_TOKEN)?.value ?? ''

  const getDecodedApiToken = (): any => {
    try {
      return jwtDecode(apiToken)
    } catch (error) {
      return null
    }
  }

  const decodedApiToken = getDecodedApiToken()

  if (token && decodedApiToken) {
    if (Date.now() >= decodedApiToken?.exp * 1000)
      return NextResponse.redirect(new URL('/login', req.url))

    if (Date.now() >= token?.exp * 1000) return NextResponse.redirect(new URL('/login', req.url))

    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {
  matcher: ['/', '/perfil', '/preferencias-clinicas-iniciais', '/solicitacoes/:path*'],
}
