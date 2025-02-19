import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getSegmentTypes,
  getSegmentTypeById,
  createSegmentType,
  updateSegmentType,
  deleteSegmentType,
} from "@/services/segments/types";

import { CreateSegmentType, SegmentType } from "@/types/segments";


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
    enabled: !!id, 
  });
}


export function useCreateSegmentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSegmentType) => createSegmentType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-types"] });
      toast.success("Segmento criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar segmento. Tente novamente.");
      console.error("Erro ao criar segmento:", error);
    },
  });
}

export function useUpdateSegmentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; values: Partial<SegmentType> }) => updateSegmentType(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-types"] });
      toast.success("Segmento atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar segmento. Tente novamente.");
      console.error("Erro ao atualizar segmento:", error);
    },
  });
}


export function useDeleteSegmentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSegmentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-types"] }); 
      toast.success("Segmento removido com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover segmento. Tente novamente.");
      console.error("Erro ao remover segmento:", error);
    },
  });
}
