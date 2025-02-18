"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Locale } from "@/i18n/config";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export interface ProvidersProps {
  children: ReactNode;
  lang: Locale;
  disableReactQueryDevtools?: boolean;
}

const Providers = ({
  children,
  lang,
}: ProvidersProps) => {
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
      <ToastContainer position="top-right" autoClose={3000} />
      <DictionaryProvider namespace="common" lang={lang}>
        {children}
      </DictionaryProvider>
    </QueryClientProvider>
  );
};

export default Providers;
