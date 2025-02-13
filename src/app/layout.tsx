"use client";

import { getPreferredLocale } from "@/i18n/getPreferredLocale";
import { GlobalStyle } from "../styles/global";
import { DM_Sans } from "next/font/google";
import Providers from "./providers";

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

  return (
    <html>
     <body className={appFont.className}>
        <Providers lang={locale}>
          <GlobalStyle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
