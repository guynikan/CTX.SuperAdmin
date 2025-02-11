import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPreferredLocale } from "@/i18n/getPreferredLocale";
import { i18n } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const locale = getPreferredLocale(request.headers);
  const url = request.nextUrl.clone();

  // Pega o locale da URL
  const pathnameLocale = url.pathname.split("/")[1] as string;

  // Se o locale na URL já for válido, não faz nada
  if (i18n.locales.includes(pathnameLocale as any)) {
    return NextResponse.next();
  }

  // Redireciona para a URL com o locale correto
  url.pathname = `/${locale}${url.pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
