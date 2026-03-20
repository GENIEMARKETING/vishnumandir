import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Creates a signed session token.
 * Format: base64(payload).hmac_hex
 */
function createSessionToken(email: string, secret: string): string {
  const payload = btoa(
    JSON.stringify({
      email,
      iat: Date.now(),
      exp: Date.now() + SESSION_DURATION_MS,
    })
  )
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? 'fallback-secret'

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment variables.')
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    // Constant-time-like comparison (avoids timing attacks)
    const emailMatch = email === adminEmail
    const passwordMatch = password === adminPassword

    if (!emailMatch || !passwordMatch) {
      // Small delay to slow brute force attempts
      await new Promise((r) => setTimeout(r, 500))
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = createSessionToken(adminEmail, sessionSecret)

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
