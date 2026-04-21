import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup", "/forgot-password", "/onboarding"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  const isPublic = publicRoutes.some((r) => request.nextUrl.pathname.startsWith(r));
  if (!token && !isPublic && !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
