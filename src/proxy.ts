import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "auth_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from /login or /register
  const publicAuthRoutes = ["/login", "/register"];
  if (publicAuthRoutes.includes(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
