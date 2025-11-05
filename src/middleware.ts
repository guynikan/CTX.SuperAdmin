import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getPreferredLocale } from "@/i18n/getPreferredLocale";
import { i18n } from "@/i18n/config";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const session = await auth();
  const locale = getPreferredLocale(request.headers);

  const pathnameLocale = pathname.split("/")[1] as string;

  // Handle locale routing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (i18n.locales.includes(pathnameLocale as any)) {
    // Already has locale, continue with auth check
  } else {
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Protected routes - exclude auth routes
  const isAuthRoute = pathname.includes('/auth/login') || pathname.includes('/auth/forgot-password');

  // If user is authenticated and tries to access login page, redirect to home
  if (session && isAuthRoute) {
    url.pathname = `/${locale}/home`;
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and tries to access protected route, redirect to login
  if (!session && !isAuthRoute) {
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
