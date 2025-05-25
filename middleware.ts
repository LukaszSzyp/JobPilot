import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Allow access to callback page without authentication
  if (req.nextUrl.pathname === "/auth/callback") {
    return res
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // TEMPORARILY DISABLED: Redirect to login if not authenticated and trying to access protected routes
  // TO RESTORE AUTHENTICATION: Uncomment the following 3 lines
  // if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url))
  // }

  // Redirect to dashboard if authenticated and trying to access auth pages (except callback)
  if (session && req.nextUrl.pathname.startsWith("/auth") && req.nextUrl.pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
