import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth'

const PROTECTED_PREFIXES = ['/dashboard', '/news']
const LOGIN_PATH = '/login'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  if (isProtected && !session) {
    console.log(`[auth] blocked ${pathname} (no/invalid session)`)
    const url = new URL(LOGIN_PATH, request.url)
    const response = NextResponse.redirect(url)
    if (token) {
      response.cookies.set(AUTH_COOKIE_NAME, '', { path: '/', maxAge: 0 })
    }
    return response
  }

  if (pathname === LOGIN_PATH && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/news/:path*', '/login'],
}
