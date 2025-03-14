import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { 
  createConfiguration,
  createConfigurationItems,
  createConfigurationSection,
  associateSectionItems,
} from "@/services/configurations";
import { Configuration, CreateConfiguration, Item, Section } from "@/types/configuration";

export function useConfigurations() {
  return useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const response = await fetch("/api/Configuration");
      if (!response.ok) throw new Error("Erro ao buscar configurações");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
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
    onError: (error) => {
      toast.error("Erro ao criar configuração. Tente novamente.");
      console.error("Erro ao criar configuração:", error);
    },
  });
}

export function useCreateConfigurationItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: Partial<Item[]> }) =>
      createConfigurationItems(items, id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["configurations", id] });
      toast.success("Itens adicionados com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar itens.");
      console.error("Erro ao adicionar itens:", error);
    },
  });
}

export function useCreateConfigurationSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (section: Partial<Section>) => createConfigurationSection(section),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast.success("Seção criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar seção.");
      console.error("Erro ao criar seção:", error);
    },
  });
}

export function useAssociateSectionItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemIds, sectionId, configurationId }: { itemIds: string[], sectionId: string, configurationId: string }) =>
      associateSectionItems(itemIds, sectionId, configurationId),
    onSuccess: (_, { configurationId }) => {
      queryClient.invalidateQueries({ queryKey: ["configurations", configurationId] });
      toast.success("Itens associados à seção com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao associar itens à seção.");
      console.error("Erro ao associar itens:", error);
    },
  });
}
