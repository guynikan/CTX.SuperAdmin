import { useQuery } from "@tanstack/react-query";

import {
  getModules,
} from "@/services/modules";

export function useModules() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
}


