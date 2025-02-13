export const appendAccessToken = (options: RequestInit, accessToken: string | null) => {
  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
};
