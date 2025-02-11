import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/services/api";

export interface SegmentType {
  name: string;
  description: string;
  priority: string;
}

// Hook para buscar usuários da API externa
export function useSegmentTypes() {
  return useQuery<SegmentType[]>({
    queryKey: ["segment-types"], 
    queryFn: () => apiFetch("/"),
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    onError: (error) => console.error("Erro no hook useSegmentTypes:", error),
  });
}
