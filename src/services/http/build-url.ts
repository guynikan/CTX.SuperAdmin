export const buildUrl = (env: NodeJS.ProcessEnv, path: string): string => {
  const baseUrl = env.NEXT_PUBLIC_API_URL || "https://dummyjson.com/c";
  return `${baseUrl}${path}`;
};
