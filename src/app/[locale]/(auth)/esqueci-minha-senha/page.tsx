"use client";

import { useDictionary } from "@/i18n/DictionaryProvider";



export default function ForgotPasswordPage(){
  const { dictionary } = useDictionary();

  return(
    <h1>{dictionary?.form.forgot_password}</h1>
  )
}