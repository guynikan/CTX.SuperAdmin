import { HttpParams } from "./params";
import { defaultErrorHandling } from "./error-handling";
import { defaultCallback } from "./response-callback";
import { defaultHeaders } from "./default-headers";
import { buildUrl } from "./build-url";
import { getAccessTokenAnywhere } from "@/lib/auth/get-access-token-anywhere";
import { appendAccessToken } from "./append-access-token";
import { signOut } from "@/auth";

export const httpService = async <T>({
  path,
  options,
  callback = defaultCallback<T>,
  config,
}: HttpParams<T>) => {
  try {
    const { signOutOnUnauthorized = true, injectAccessToken = true } = config ?? {};

    if (!options.headers) {
      options.headers = defaultHeaders();
    }

    if (injectAccessToken) {
      const accessToken = await getAccessTokenAnywhere();
      if (accessToken && accessToken !== 'No accessToken') {
        options.headers = appendAccessToken(options.headers, accessToken);
      }
    }

    const response = await fetch(buildUrl(process.env, path), options);

    if (signOutOnUnauthorized && !response.ok && response.status === 401) {
      console.warn("Usuário não autorizado, redirecionando para login...");
      if (typeof window !== 'undefined') {
        await signOut({ redirectTo: '/auth/login' });
      }
      return;
    }

    if (!response.ok) {
      const errorBody = await response.text(); 
      throw new Error(errorBody);
    }

  
    return callback?.(response);
  } catch (error) {
    throw defaultErrorHandling(error);
  }
};
