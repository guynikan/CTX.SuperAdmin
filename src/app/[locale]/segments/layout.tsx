"use client";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <DictionaryProvider namespaces={["common", "segments"]}>{children}</DictionaryProvider>; 
}
