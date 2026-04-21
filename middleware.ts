import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup", "/forgot-password", "/onboarding"];

export function middleware(request: NextRequest) {
  const hasSupabaseAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("auth-token"));
  const isPublic = publicRoutes.some((r) => request.nextUrl.pathname.startsWith(r));
  if (!hasSupabaseAuthCookie && !isPublic && !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
