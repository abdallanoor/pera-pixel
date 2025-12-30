import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Paths that require authentication
const protectedPaths = ["/admin"];
// Paths that should redirect to dashboard if already authenticated
const authPaths = ["/admin/login"];
// API paths that require authentication
const protectedApiPaths = ["/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token from cookies
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Check if the path is an API path that requires authentication
  const isProtectedApiPath = protectedApiPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedApiPath) {
    // Verify the token for API routes
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Token is valid, continue to API route
    return NextResponse.next();
  }

  // Check if the path is an auth path (login page)
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPath) {
    // If user is already logged in, redirect to dashboard
    if (token) {
      const session = await verifyToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin/videos", request.url));
      }
    }
    // Not logged in, allow access to login page
    return NextResponse.next();
  }

  // Check if the path is a protected path
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Verify token for protected routes
    if (!token) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyToken(token);
    if (!session) {
      // Token is invalid or expired, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Token is valid, continue
    return NextResponse.next();
  }

  // For all other paths, continue without modification
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths starting with /admin
    "/admin/:path*",
    // Match all API paths starting with /api/admin
    "/api/admin/:path*",
  ],
};
