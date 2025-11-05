import { getAccessTokenAnywhere } from '@/lib/auth/get-access-token-anywhere';
import { httpErrorHandling } from './error-handling';
import { appendAccessToken } from './append-access-token';
import { appendTenantId } from './headers/append-tenant-id';
import { defaultHeaders } from './default-headers';
import { HttpParams } from './params';

export const httpIdentityService = async <T = Response>({
  path,
  options,
  callback = async (response) => {
    return response as T;
  },
  config,
}: HttpParams<T>): Promise<T | undefined> => {
  try {
    const { signOutOnUnauthorized = false, injectAccessToken = false } = config ?? {};

    if (!options.headers) {
      options.headers = defaultHeaders();
    } else {
      // Se headers já existem, garantir que sejam Headers object
      options.headers = new Headers(options.headers);
    }

    if (injectAccessToken) {
      const accessToken = await getAccessTokenAnywhere();
      options.headers = appendAccessToken(options, accessToken);
    }

    // Sempre adicionar x-tenant-id
    options.headers = appendTenantId(options);

    const identityApiUrl = process.env.NEXT_PUBLIC_IDENTITY_API_URL;
    
    if (!identityApiUrl) {
      throw new Error('NEXT_PUBLIC_IDENTITY_API_URL environment variable is not set');
    }

    const response = await fetch(`${identityApiUrl}${path}`, options);

    if (signOutOnUnauthorized && !response.ok && response.status === 401) {
      console.warn('Usuário não autorizado, redirecionando para login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return;
    }

    return callback?.(response);
  } catch (error) {
    throw httpErrorHandling(error);
  }
};

