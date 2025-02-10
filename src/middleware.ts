import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localeFromPath = pathname.split('/')[1];

  const locales = ['pt', 'en'];

  let locale = 'pt'; // Usar assim enquanto não pegamos o locale pela API
  
  if (locales.includes(localeFromPath)) {
    locale = localeFromPath;
  } 

  if (!locales.includes(localeFromPath)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
