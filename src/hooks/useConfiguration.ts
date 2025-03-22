// hooks/useConfiguration.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createConfiguration,
  createConfigurationItems,
  createConfigurationSection,
  associateSectionItems,
  getConfigurationById,
  createConfigurationRuleSet,
} from "@/services/configurations";
import { CreateConfiguration, Item, Section } from "@/types/configuration";
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

export function useConfigurationMutations(configurationId: string) {
  const queryClient = useQueryClient();
  const createItemsMutation = useMutation({
    mutationFn: (items: Partial<Item[]>) =>
      createConfigurationItems(items, configurationId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["configuration", configurationId] }),
  });

  const createSectionMutation = useMutation({
    mutationFn: (section: Partial<Section>) =>
      createConfigurationSection(configurationId, section),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["configuration", configurationId] }),
  });

  const associateItemsMutation = useMutation({
    mutationFn: ({ sectionId, itemIds }: { sectionId: string; itemIds: string[] }) =>
      associateSectionItems(configurationId, sectionId, itemIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["configuration", configurationId] }),
  });

  const associateItemsToSectionProcess = async (sectionId: string, itemIds: string[]) => {
    if (!sectionId || !itemIds.length) return;
    try {
      await associateItemsMutation.mutateAsync({ sectionId, itemIds });
    } catch (error) {
      console.error("Erro ao associar itens à seção:", error);
    }
  };
  const createRuleSetMutation = useMutation({

    mutationFn: async (data: any) => {
      createConfigurationRuleSet(configurationId, data)},
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["configuration", configurationId] }),
  });

  return {
    createItemsMutation,
    createSectionMutation,
    associateItemsToSectionProcess,
    createRuleSetMutation
  };
}
