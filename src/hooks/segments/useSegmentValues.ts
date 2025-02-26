import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


import {
  getSegmentValues,
  getSegmentValueById,
  getSegmentValuesByType,
  createSegmentValue,
  updateSegmentValue,
  deleteSegmentValue,
} from "@/services/segments/values";
import { CreateSegmentValue, SegmentValue } from "@/types/segments";
import { toast } from "react-toastify";

export function useSegmentValues() {
  return useQuery({
    queryKey: ["segment-values"],
    queryFn: getSegmentValues,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useSegmentValueById(id: string) {
  return useQuery({
    queryKey: ["segment-value", id],
    queryFn: () => getSegmentValueById(id),
    enabled: !!id,
  });
}

export function useSegmentValuesByType(segmentTypeId: string) {
  return useQuery({
    queryKey: ["segment-values-by-type", segmentTypeId],
    queryFn: () => getSegmentValuesByType(segmentTypeId),
    enabled: !!segmentTypeId,
  });
}

export function useCreateSegmentValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSegmentValue) => createSegmentValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
      toast.success("Segmento criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao criar o segmento.");
    },
  });
}

export function useUpdateSegmentValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SegmentValue> }) => updateSegmentValue(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["segment-value", id] });
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
      toast.success("Segmento editado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao criar o segmento.");
    },
  });
}

export function useDeleteSegmentValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSegmentValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
    },
  });
}
