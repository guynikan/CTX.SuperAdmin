export const appendAccessToken = (
  options: Headers | Pick<RequestInit, 'headers'>,
  accessToken: string | null,
) => {
  if (!accessToken) {
    return options instanceof Headers ? options : new Headers(options.headers);
  }

  const headers = options instanceof Headers ? options : new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  return headers;
};
