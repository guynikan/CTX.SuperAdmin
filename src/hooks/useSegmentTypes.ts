import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSegmentTypes,
  getSegmentTypeById,
  createSegmentType,
  updateSegmentType,
  deleteSegmentType,
} from "@/services/segment-types";

import { SegmentType } from "@/types/segments";


export function useSegmentTypes() {
  return useQuery({
    queryKey: ["segment-types"],
    queryFn: getSegmentTypes,
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
}

export function useSegmentTypeById(id: string) {
  return useQuery({
    queryKey: ["segment-type", id],
    queryFn: () => getSegmentTypeById(id),
    enabled: !!id, // Só busca se `id` for válido
  });
}

export function useCreateSegmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSegmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-types"] });
    },
  });
}


export function useUpdateSegmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SegmentType> }) => updateSegmentType(id, data),
    onSuccess: (_, { id }) => { 
      queryClient.invalidateQueries({ queryKey: ["segment-type", id] }); 
      queryClient.invalidateQueries({ queryKey: ["segment-types"] });
    },
  });
}

export function useDeleteSegmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSegmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-types"] }); 
    },
  });
}
