export const appendUrlEncoded = (params?: Headers) => {
  const headers = new Headers(params);
  headers.append('Accept', '*/*');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  return headers;
};

