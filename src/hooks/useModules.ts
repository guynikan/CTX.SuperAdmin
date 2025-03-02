import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
} from "@/services/modules";
import { CreateModule } from "@/types/modules";
import { toast } from "react-toastify";

export function useModules() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
}

export function useModuleById(id: string) {
  return useQuery({
    queryKey: ["modules", id],
    queryFn: () => getModuleById(id),
    enabled: !!id,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModule) => createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Módulo criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar Módulo. Tente novamente.");
      console.error("Erro ao criar Módulo:", error);
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] }); 
      toast.success("Módulo removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao remover o modulo.");
    },
  });
}


