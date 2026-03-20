import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'

/**
 * Verifies an admin session token using Web Crypto API (Edge Runtime compatible).
 * Token format: base64url(payload).hexsig
 */
async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return false

    const payload = token.substring(0, dotIndex)
    const sig = token.substring(dotIndex + 1)

    // Import the secret key
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Convert hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      (sig.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16))
    )

    // Verify HMAC
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload))
    if (!valid) return false

    // Check expiry
    const data = JSON.parse(atob(payload))
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return false

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on /admin routes — skip the login page itself
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'fallback-secret'

  if (!sessionCookie?.value || !(await verifySessionToken(sessionCookie.value, secret))) {
    const loginUrl = new URL('/admin/login', request.url)
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all /admin routes
  matcher: ['/admin/:path*'],
}
