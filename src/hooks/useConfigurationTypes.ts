import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getConfigurationTypes,
  getConfigurationTypeById,
  createConfigurationType,
  updateConfigurationType,
  deleteConfigurationType,
} from "@/services/configurations/types";

import { ConfigurationType } from "@/types/configuration";

export function useConfigurationTypes() {
  return useQuery({
    queryKey: ["configuration-types"],
    queryFn: getConfigurationTypes,
    staleTime: 1000 * 60 * 5, 
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useConfigurationTypeById(id: string) {
  return useQuery({
    queryKey: ["configuration-type", id],
    queryFn: () => getConfigurationTypeById(id),
    enabled: !!id,
  });
}

export function useCreateConfigurationType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ConfigurationType>) => createConfigurationType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-types"] });
      toast.success("Tipo de configuração criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar tipo de configuração.");
      console.error("Erro ao criar tipo de configuração:", error);
    },
  });
}

export function useUpdateConfigurationType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ConfigurationType> }) =>
      updateConfigurationType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["configuration-type", id] });
      queryClient.invalidateQueries({ queryKey: ["configuration-types"] });
      toast.success("Tipo de configuração atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar tipo de configuração.");
      console.error("Erro ao atualizar tipo de configuração:", error);
    },
  });
}

export function useDeleteConfigurationType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConfigurationType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration-types"] });
      toast.success("Tipo de configuração removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover tipo de configuração.");
    },
  });
}
