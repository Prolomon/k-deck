import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "kdeck_super_secret_jwt_admin_key_2026_change_in_production";
const key = new TextEncoder().encode(SECRET_KEY);
const ADMIN_COOKIE_NAME = "kdeck_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, key);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If already authenticated via cookie and accessing login page, redirect to dashboard
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If accessing protected admin route without valid session cookie, redirect to /admin/login
    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
