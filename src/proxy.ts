import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("cvnet_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. DYNAMIC CONSOLE LOGGING
  console.log("==================================================");
  console.log("🛡️  PROXY INTERCEPTED URL PATH:", pathname);
  console.log("🍪 AUTH COOKIE FOUND?:", token ? "YES (Token is present)" : "NO COOKIE FOUND");

  // 2. DEFINE EXPLICIT PUBLIC ENTRIES
  // Any route NOT listed here will automatically require an active token
  const publicRoutes = ["/login", "/signup", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log("🔒 ROUTE ACCESS TYPE:", isPublicRoute ? "PUBLIC" : "PROTECTED RESOURCE");

  // 3. ENFORCE AUTHENTICATION BLOCK
  if (!isPublicRoute && !token) {
    console.log("🚨 ACCESS DENIED: Redirecting unauthorized request to /login");
    console.log("==================================================");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ ACCESS GRANTED: Compiling page components...");
  console.log("==================================================");
  return NextResponse.next();
}

// 4. GLOBAL MATCHER SYSTEM
// This matches all application paths except static assets, images, and system files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Internal API routes)
     * - _next/static (static framework files)
     * - _next/image (image optimization utilities)
     * - favicon.ico, logo.jpeg (root assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.jpeg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};