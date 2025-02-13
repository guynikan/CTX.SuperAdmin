"use client";

import { useDictionary } from "@/i18n/DictionaryProvider";



export default function ForgotPasswordPage(){
  const { dictionary } = useDictionary();

  return(
    <h1>{dictionary?.forgot_password}</h1>
  )
}