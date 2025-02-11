const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com/c/6036-5428-4661-b2d4";


export async function apiFetch<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Erro ${response.status}: ${response.statusText} ${
          errorData?.message ? `- ${errorData.message}` : ""
        }`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    throw new Error(`Falha ao carregar dados. Tente novamente mais tarde.`);
  }
}
