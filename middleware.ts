import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Always allow access to callback page
  if (req.nextUrl.pathname === "/auth/callback") {
    return res
  }

  // WYŁĄCZAMY CAŁKOWICIE PRZEKIEROWANIA Z DASHBOARD
  // Dashboard jest dostępny dla wszystkich - zarówno zalogowanych jak i w trybie demo
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return res
  }

  try {
    // Get session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an error getting session, log it but don't redirect
    if (error) {
      console.error("Middleware session error:", error)
      return res
    }

    // TYLKO przekieruj zalogowanych użytkowników ze stron auth (oprócz callback)
    if (session && req.nextUrl.pathname.startsWith("/auth") && req.nextUrl.pathname !== "/auth/callback") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of any error, allow access
    return res
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
