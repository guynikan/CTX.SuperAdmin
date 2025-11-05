export interface HttpParams<T = unknown> {
  path: string;
  options: RequestInit;
  callback?: (response: Response) => Promise<T>;
  config?: {
    throwError?: boolean;
    signOutOnUnauthorized?: boolean;
    injectAccessToken?: boolean;
  };
}
