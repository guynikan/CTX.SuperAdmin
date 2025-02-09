import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localeFromPath = pathname.split('/')[1];

  const locales = ['en', 'pt'];

  let locale = 'pt'; // Usar assim enquanto não pegamos o locale pela API
  if (locales.includes(localeFromPath)) {
    locale = localeFromPath;
  } else {
    // Outra alternativa, pegar pelo header:
    const headerLocale = req.headers.get('accept-language')?.split(',')[0].split('-')[0];
    if (headerLocale && locales.includes(headerLocale)) {
      locale = headerLocale;
    }
  }

  if (!locales.includes(localeFromPath)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
