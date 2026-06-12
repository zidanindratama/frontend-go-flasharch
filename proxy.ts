import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authPages = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/verify-email",
  "/reset-password",
]

function redirectByRole(role: string | undefined, base: URL) {
  if (role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", base))
  }
  return NextResponse.redirect(new URL("/account", base))
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authCookie = request.cookies.get("gfa-auth")
  const roleCookie = request.cookies.get("gfa-role")

  const isDashboard = pathname.startsWith("/dashboard")
  const isAccount = pathname.startsWith("/account")
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    if (authCookie) {
      return redirectByRole(roleCookie?.value, request.nextUrl)
    }
    return NextResponse.next()
  }

  if (isDashboard || isAccount) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if (isDashboard && roleCookie?.value !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (isAccount && roleCookie?.value === "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-email",
    "/reset-password",
    "/dashboard/:path*",
    "/account/:path*",
  ],
}
