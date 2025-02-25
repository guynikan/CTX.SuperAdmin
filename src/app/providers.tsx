"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Locale } from "@/i18n/config";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { theme } from "@/styles/theme";

export interface ProvidersProps {
  children: ReactNode;
  lang: Locale;
}


const Providers = ({ children, lang }: ProvidersProps) => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        onError: (error) => {
          const appError = error as any;
          let errorMessage = appError.message || "Erro desconhecido";

          if (appError.errors) {
            errorMessage = Object.values(appError.errors)
              .map((errArray: any) => errArray[0])
              .join("\n");
          }

          setError(errorMessage);
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer position="top-right" autoClose={3000} />
        <DictionaryProvider namespace="common" lang={lang}>
          {children}
        </DictionaryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
