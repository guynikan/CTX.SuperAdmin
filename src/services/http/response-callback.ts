export const defaultCallback = async <T>(response: Response): Promise<T> => {
  return response.json()
};