export const buildUrl = (env: NodeJS.ProcessEnv, path: string): string => {
  const baseUrl =  process.env.NEXT_PUBLIC_API_URL;
  return `${baseUrl}${path}`;
};
