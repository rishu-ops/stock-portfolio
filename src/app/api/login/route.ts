import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  AUTH_COOKIE_NAME,
  VALID_CREDENTIALS,
  buildCookieOptions,
  signSessionToken,
} from '@/lib/auth'

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { email, password } = raw as {
    email?: unknown
    password?: unknown
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim() === '' ||
    password === ''
  ) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  if (
    email !== VALID_CREDENTIALS.email ||
    password !== VALID_CREDENTIALS.password
  ) {
    console.log(`[auth] login failed: ${email}`)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signSessionToken(email)
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, buildCookieOptions())

  console.log(`[auth] login success: ${email}`)
  return NextResponse.json({ success: true })
}
