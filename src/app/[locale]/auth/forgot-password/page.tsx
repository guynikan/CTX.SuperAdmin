"use client";

import { useDictionary } from "@/i18n/DictionaryProvider";



export default function ForgotPasswordPage(){
  const {  dictionary: translations } = useDictionary();
  const dictionary = translations.modules;
  return(
    <h1>{(dictionary as any)?.forgot_password || 'Forgot Password'}</h1>
  )
}