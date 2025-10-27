import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createConfiguration,
  getConfigurationById,
  updateConfiguration,
} from "@/services/configurations";
import { CreateConfiguration, UpdateConfiguration } from "@/types/configuration";
import { getConfigurationTypes } from "@/services/configurations/types";

export function useConfigurationTypes() {
  return useQuery({
    queryKey: ["configurationTypes"],
    queryFn: getConfigurationTypes,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });
}

export function useConfigurationById(id: string) {
  return useQuery({
    queryKey: ["configuration", id],
    queryFn: () => getConfigurationById(id),
    enabled: !!id,
  });
}

export function useCreateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConfiguration) => createConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast.success("Configuração criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar configuração.");
    },
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ configId, data }: { configId: string; data: UpdateConfiguration }) =>
      updateConfiguration(configId, data),
    onSuccess: (updatedConfig, { configId }) => {
      // Update the specific configuration cache
      queryClient.setQueryData(["configuration", configId], updatedConfig);
      
      // Invalidate configurations list to refresh any summaries
      queryClient.invalidateQueries({ 
        queryKey: ["configurations"],
        refetchType: "active" 
      });
      
      toast.success("Configuração atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating configuration:", error);
      toast.error("Erro ao atualizar configuração.");
    },
  });
}