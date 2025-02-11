"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { getPreferredLocale } from "@/i18n/getPreferredLocale";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const locale = getPreferredLocale();

  return (
    <html lang={locale}>
      <QueryClientProvider client={queryClient}>
        <DictionaryProvider locale={locale}>
          <body>{children}</body>
        </DictionaryProvider>
      </QueryClientProvider>
    </html>
  );
}
