"use client";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <DictionaryProvider namespace="login">{children}</DictionaryProvider>;
}
