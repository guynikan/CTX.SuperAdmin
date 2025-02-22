import { useQuery } from "@tanstack/react-query";

import {
  getSegmentTypes,
} from "@/services/segments/types";

export function useSegmentTypes() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getSegmentTypes,
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
}


