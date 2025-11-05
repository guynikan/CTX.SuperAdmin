'use server';

import { httpIdentityService } from '@/services/http/identity.service';
import { appendClientId } from '@/services/http/body/append-client-id';
import { appendClientSecret } from '@/services/http/body/append-client-secret';
import { httpErrorHandling } from '@/services/http/error-handling';
import { appendUrlEncoded } from '@/services/http/headers/append-urlencoded';

export async function postRefreshTokenRequest({
  refreshToken,
  username,
}: {
  refreshToken: string;
  username: string;
}): Promise<Response> {
  try {
    const path = '/Access/token';

    let body = new URLSearchParams();
    body.append('GrantType', 'refresh_token');
    body.append('RefreshToken', refreshToken);
    body.append('Username', username);
    body = appendClientId(body);
    body = appendClientSecret(body);

    const options = {
      method: 'POST',
      headers: appendUrlEncoded(),
      body: body.toString(),
    };

    const res = await httpIdentityService<Response>({
      path,
      options,
      callback: async (response) => response,
    });

    if (!res) {
      throw new Error('No response from identity service');
    }

    return res;
  } catch (error) {
    throw httpErrorHandling(error);
  }
}

