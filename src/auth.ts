import { addSeconds, fromUnixTime, isAfter } from 'date-fns';
import { decodeJwt } from 'jose';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { fail, isFail, ok, wrapAsync } from './helpers/result';
import { assertStringNotEmpty } from './helpers/invariants';
import { postRefreshTokenRequest } from './services/http/identity/post-refresh-token/request';
import { postTokenRequest } from './services/http/identity/post-token/request';

export function isCloseToExpirationDate(timestamp: number) {
  const expiresIn = timestamp ?? 0; // expires in is a Unix Timestamp
  const secondsBeforeExpire = 60;
  const expiryDate = fromUnixTime(expiresIn);
  const refreshThreshold = addSeconds(expiryDate, -secondsBeforeExpire);
  return isAfter(new Date(), refreshThreshold);
}

async function extractJWT(response: Response) {
  const json = await wrapAsync<{
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }>(response.json());

  if (isFail(json)) {
    const failedResponseAsText = await wrapAsync(response.text());
    console.error(json.message, failedResponseAsText);
    return fail('Invalid data');
  }

  const claims = decodeJwt(json.value.accessToken);

  if (!claims) {
    return fail('Invalid data');
  }

  const jwt: JWT = {
    accessToken: json.value.accessToken,
    expiresIn: claims.exp || 0,
    refreshToken: json.value.refreshToken,
    refreshTokenExpiresIn: json.value.refreshTokenExpiresIn,
  };

  return ok(jwt);
}

export const { handlers, signIn, auth, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ password, username }) {
        try {
          assertStringNotEmpty(username, 'Username is required');
          assertStringNotEmpty(password, 'Password is required');

          const response = await wrapAsync(
            postTokenRequest({
              username: username as string,
              password: password as string,
            }),
          );

          if (isFail(response)) {
            console.error(response);
            throw new Error(response.message);
          }

          const responseValue = response.value as Response;

          if (!responseValue.ok) {
            const textContent = await wrapAsync(responseValue.text());
            const errorText = isFail(textContent) ? textContent.message : textContent.value;
            console.error('Token request failed:', {
              status: responseValue.status,
              statusText: responseValue.statusText,
              body: errorText,
            });
            throw new Error(`HTTP error! status: ${responseValue.status}`);
          }

          const jwt = await extractJWT(responseValue);

          if (isFail(jwt)) {
            return null;
          }

          return {
            ...jwt.value,
            username: username as string,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      if (account && user) {
        return {
          ...user,
          username: user.username,
        };
      }

      if (trigger === 'update' && session?.newAccessToken) {
        const claims = decodeJwt(session.newAccessToken);

        return {
          ...token,
          accessToken: session.newAccessToken,
          expiresIn: claims?.exp,
          username: token.username,
        };
      }

      if (!isCloseToExpirationDate(token.expiresIn ?? 0)) {
        return token;
      }

      if (!token.refreshToken) {
        throw new Error('Refresh token is missing');
      }

      if (!token.username) {
        throw new Error('Username is missing');
      }

      const response = await wrapAsync(
        postRefreshTokenRequest({
          refreshToken: token.refreshToken,
          username: token.username,
        }),
      );

      if (isFail(response)) {
        token.error = 'RefreshTokenError';
        return token;
      }

      const responseValue = response.value as Response;

      if (!responseValue.ok) {
        token.error = 'RefreshTokenError';
        return token;
      }

      const jwt = await extractJWT(responseValue);

      if (isFail(jwt)) {
        token.error = 'RefreshTokenError';
        return token;
      }

      // Preserve our custom properties
      const updatedJwt = {
        ...jwt.value,
        username: token.username,
      };

      return updatedJwt;
    },
    session: ({ session, token }) => {
      return { ...session, ...token };
    },
  },
});

