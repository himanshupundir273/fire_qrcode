import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Redirect unauthenticated users away from protected routes
  if (!user) {
    if (
      path.startsWith('/admin/dashboard') ||
      path.startsWith('/technician/dashboard')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Redirect authenticated users away from login pages
  if (path === '/login' || path === '/admin/login' ||
      path === '/technician/login' || path === '/technician/signup') {
    const adminEmail = process.env.ADMIN_EMAIL
    const url = request.nextUrl.clone()
    if (user.email === adminEmail) {
      url.pathname = '/admin/dashboard'
    } else {
      url.pathname = '/technician/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
