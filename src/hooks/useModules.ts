import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createModule,
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



