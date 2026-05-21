import { SignJWT, jwtVerify } from 'jose'

export const AUTH_COOKIE_NAME = 'session'
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 // 1 hour

export const VALID_CREDENTIALS = {
  email: 'test@finapp.com',
  password: '123456',
} as const

export type SessionPayload = {
  sub: string
  exp: number
  iat: number
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SECONDS}s`)
    .sign(getSecret())
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.exp !== 'number' ||
      typeof payload.iat !== 'number'
    ) {
      return null
    }
    return { sub: payload.sub, exp: payload.exp, iat: payload.iat }
  } catch {
    return null
  }
}

export function buildCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  }
}
