import { HttpParams } from "./params";
import { defaultErrorHandling } from "./error-handling";
import { defaultCallback } from "./response-callback";
import { defaultHeaders } from "./default-headers";
import { buildUrl } from "./build-url";

export const httpService = async <T>({
  path,
  options,
  callback = defaultCallback<T>,
  config,
}: HttpParams<T>) => {
  try {
    const { signOutOnUnauthorized = true } = config ?? {};

    if (!options.headers) {
      options.headers = defaultHeaders();
    }

    const response = await fetch(buildUrl(process.env, path), options);

    if (signOutOnUnauthorized && !response.ok && response.status === 401) {
      console.warn("Usuário não autorizado, redirecionando para login...");
      return;
    }

    return callback?.(response);
  } catch (error) {
    throw defaultErrorHandling(error);
  }
};
