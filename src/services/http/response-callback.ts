export const defaultCallback = async <T>(response: Response): Promise<T | undefined> => {
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T; 
  }
  return response.json();
};
