import { NextRequest, NextResponse } from 'next/server'

/*
 * Legacy v0.1 callback endpoint. Any v0.1 HMAC magic link that still hits
 * this URL after the v0.2 cutover is expired by construction. Bounce the
 * user to the login page with an expired flag so they request a fresh
 * Supabase magic link.
 */
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/portal/login/?err=expired`)
}
