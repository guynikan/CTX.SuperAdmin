"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { theme } from "../styles/theme";
import { GlobalStyle } from "../styles/global";

import { DM_Sans } from "next/font/google";

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
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <body className={appFont.className}>{children}</body>
          </ThemeProvider>
      </QueryClientProvider>

    </html>
  );
}
