import { getClientAccessToken } from './get-client-access-token';
import { getServerAccessToken } from './get-server-access-token';

export async function getAccessTokenAnywhere() {
  if (typeof window === 'undefined') {
    return await getServerAccessToken();
  }

  return await getClientAccessToken();
}

