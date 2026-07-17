import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/portal/supabase-server'

async function signOutAndRedirect(request: Request) {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  const url = new URL('/portal/login/', request.url)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  return signOutAndRedirect(request)
}

export async function GET(request: Request) {
  return signOutAndRedirect(request)
}
