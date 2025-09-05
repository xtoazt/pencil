import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/chat", "/projects", "/history", "/settings"]

// Public routes that redirect to dashboard if authenticated
const publicRoutes = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get("auth-token")?.value

  // Check if user is authenticated
  let isAuthenticated = false
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      isAuthenticated = !!decoded
    } catch (error) {
      // If token is invalid, clear it
      const response = NextResponse.next()
      response.cookies.set("auth-token", "", { maxAge: 0 })
      return response
    }
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
