'use server';

import { httpIdentityService } from '@/services/http/identity.service';
import { appendClientId } from '@/services/http/body/append-client-id';
import { appendClientSecret } from '@/services/http/body/append-client-secret';
import { httpErrorHandling } from '@/services/http/error-handling';
import { appendUrlEncoded } from '@/services/http/headers/append-urlencoded';

export async function postTokenRequest({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const path = '/Access/token';

    let body = new URLSearchParams();
    body.append('GrantType', 'password');
    body.append('Username', username);
    body.append('Password', password);

    body = appendClientId(body);
    body = appendClientSecret(body);

    const options: RequestInit = {
      method: 'POST',
      headers: appendUrlEncoded(),
      body: body.toString(),
      redirect: 'follow',
    };

    const res = await httpIdentityService({
      path,
      options,
    });

    return res;
  } catch (error) {
    throw httpErrorHandling(error);
  }
}
