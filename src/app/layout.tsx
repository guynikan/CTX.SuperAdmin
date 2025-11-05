"use client";

import { getPreferredLocale } from "@/i18n/getPreferredLocale";
import { DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import Providers from "./providers";
import Header from "./components/Header";

const appFont = DM_Sans({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getPreferredLocale();
  const pathname = usePathname();
  
  // Não mostrar header nas rotas de autenticação
  const isAuthRoute = pathname?.includes('/auth/login') || pathname?.includes('/auth/forgot-password');

  return (
    <html>
     <body style={ {padding:0, boxSizing:'border-box', margin: 0,}} className={appFont.className}>
        <Providers lang={locale}>
          {!isAuthRoute && <Header/>}
          {children}
        </Providers>
      </body>
    </html>
  );
}
