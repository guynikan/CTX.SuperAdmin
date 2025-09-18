import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getConfigurationAssociations,
  getAssociatedConfigurationById,
  updateAssociatedConfiguration,
  createConfiguration,
  deleteAssociatedConfiguration,
  createAssociation,
  updateAssociation,
  deleteAssociation,
} from "@/services/configurations/associations";
import {
  ConfigurationAssociation,
  AssociatedConfiguration,
  CreateAssociatedConfiguration,
  UpdateAssociatedConfiguration,
  CreateAssociation,
} from "@/types/associations";

// Get all associations for a configuration
export function useConfigurationAssociations(configId: string) {
  return useQuery({
    queryKey: ["configurationAssociations", configId],
    queryFn: () => getConfigurationAssociations(configId),
    enabled: !!configId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Get a specific associated configuration
export function useAssociatedConfiguration(configId: string) {
  return useQuery({
    queryKey: ["associatedConfiguration", configId],
    queryFn: () => getAssociatedConfigurationById(configId),
    enabled: !!configId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

// Update associated configuration mutation
export function useUpdateAssociatedConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ configId, data }: { configId: string; data: UpdateAssociatedConfiguration }) =>
      updateAssociatedConfiguration(configId, data),
    onSuccess: (updatedConfig, { configId }) => {
      // Update the specific configuration cache
      queryClient.setQueryData(["associatedConfiguration", configId], updatedConfig);
      
      // Invalidate associations list to refresh any association summaries
      queryClient.invalidateQueries({ 
        queryKey: ["configurationAssociations"],
        refetchType: "active" 
      });
      
      toast.success("Configuração associada atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating associated configuration:", error);
      toast.error("Erro ao atualizar configuração associada.");
    },
  });
}

// Create new configuration mutation
export function useCreateAssociatedConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssociatedConfiguration) => createConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurationAssociations"] });
      toast.success("Nova configuração criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating configuration:", error);
      toast.error("Erro ao criar nova configuração.");
    },
  });
}

// Delete configuration mutation
export function useDeleteAssociatedConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configId: string) => deleteAssociatedConfiguration(configId),
    onSuccess: (_, configId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["associatedConfiguration", configId] });
      queryClient.invalidateQueries({ queryKey: ["configurationAssociations"] });
      
      toast.success("Configuração removida com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting configuration:", error);
      toast.error("Erro ao remover configuração.");
    },
  });
}

// Create association mutation
export function useCreateAssociation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssociation) => createAssociation(data),
    onSuccess: (_, { sourceConfigurationId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ["configurationAssociations", sourceConfigurationId] 
      });
      toast.success("Associação criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating association:", error);
      toast.error("Erro ao criar associação.");
    },
  });
}

// Update association mutation (only isActive)
export function useUpdateAssociation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ associationId, isActive }: { associationId: string; isActive: boolean }) =>
      updateAssociation(associationId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurationAssociations"] });
      toast.success("Status da associação atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating association:", error);
      toast.error("Erro ao atualizar associação.");
    },
  });
}

// Delete association mutation
export function useDeleteAssociation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sourceConfigId, associationId }: { sourceConfigId: string; associationId: string }) =>
      deleteAssociation(sourceConfigId, associationId),
    onSuccess: (_, { sourceConfigId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ["configurationAssociations", sourceConfigId] 
      });
      toast.success("Associação removida com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting association:", error);
      toast.error("Erro ao remover associação.");
    },
  });
}

// Combined hook for managing all aspects of associated configurations
export function useAssociatedConfigurationsManager(configId: string) {
  const associations = useConfigurationAssociations(configId);
  const updateMutation = useUpdateAssociatedConfiguration();
  const createMutation = useCreateAssociatedConfiguration();
  const deleteMutation = useDeleteAssociatedConfiguration();
  const createAssociationMutation = useCreateAssociation();
  const updateAssociationMutation = useUpdateAssociation();
  const deleteAssociationMutation = useDeleteAssociation();

  return {
    // Data
    associations: associations.data || [],
    isLoading: associations.isLoading,
    error: associations.error,
    
    // Mutations
    updateConfiguration: updateMutation.mutateAsync,
    createConfiguration: createMutation.mutateAsync,
    deleteConfiguration: deleteMutation.mutateAsync,
    createAssociation: createAssociationMutation.mutateAsync,
    updateAssociation: updateAssociationMutation.mutateAsync,
    deleteAssociation: deleteAssociationMutation.mutateAsync,
    
    // Loading states
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
