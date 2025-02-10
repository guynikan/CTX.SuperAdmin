"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html >
      <QueryClientProvider client={queryClient}>
        <body>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
