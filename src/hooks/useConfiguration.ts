import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { 
  createConfiguration,
  createConfigurationItems,
  createConfigurationSection,
  associateSectionItems,
  getConfigurationById,
} from "@/services/configurations";

import { CreateConfiguration, Item, Section } from "@/types/configuration";
import { getConfigurationTypes } from "@/services/configurations/types";

export function useConfigurationTypes() {
  return useQuery({
    queryKey: ["configurationsTypes"],
    queryFn: getConfigurationTypes,
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
}

export function useConfigurationMutations(configurationId: string) {
  const queryClient = useQueryClient();

  const createItemsMutation = useMutation({
    mutationFn: (items) => createConfigurationItems(items, configurationId),
    onSuccess: () => queryClient.invalidateQueries(["configuration", configurationId]),
  });

  const createSectionMutation = useMutation({
    mutationFn: (section) => createConfigurationSection(configurationId, section),
    onSuccess: () => queryClient.invalidateQueries(["configuration", configurationId]),
  });

  const associateItemsMutation = useMutation({
    mutationFn: ({ sectionId, itemIds }) => associateSectionItems(configurationId, sectionId, itemIds),
    onSuccess: () => queryClient.invalidateQueries(["configuration", configurationId]),
  });

  const associateItemsToSectionProcess = async (sectionId: string, itemIds: string[]) => {
    if (!sectionId || !itemIds.length) return;
    try {
      await associateItemsMutation.mutateAsync({ sectionId, itemIds });
    } catch (error) {
      console.error("Erro ao associar itens à seção:", error);
      throw error;
    }
  };

  return {
    createItemsMutation,
    createSectionMutation,
    associateItemsMutation,
    associateItemsToSectionProcess,
  };
}

export function useCreateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConfiguration) => createConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast.success("Configuração criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar configuração. Tente novamente.");
      console.error("Erro ao criar configuração:", error);
    },
  });
}

export function useConfigurationById(id: string) {
  return useQuery({
    queryKey: ["configuration", id],
    queryFn: () => getConfigurationById(id),
    enabled: !!id,
  });
}
