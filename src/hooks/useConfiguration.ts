import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConfiguration, createConfigurationItems, createConfigurationSection, associateSectionItems } from "@/services/configuration";
import { Configuration } from "@/types/configuration";
import { toast } from "react-toastify";

interface CreateFullConfigurationInput {
  configuration: Omit<Configuration, "id">; 
  items: { name: string; order: number; properties: string }[];
  sections: { name: string; order: number; properties: string }[];
  sectionItemAssociations: { sectionId: string; itemIds: string[] }[];
}

export function useConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ configuration, items, sections, sectionItemAssociations }: CreateFullConfigurationInput) => {
      try {
       
        const createdConfig = await createConfiguration({
          ...configuration,
          isActive: true, 
        });

        if (!createdConfig?.id) throw new Error("Falha ao criar a configuração");

        toast.success("Configuração criada com sucesso!");

        
        const createdItems = await createConfigurationItems({ items }, createdConfig.id);
        if (!createdItems) throw new Error("Falha ao adicionar itens");

        toast.success("Itens adicionados com sucesso!");

        const createdSections = [];
        for (const section of sections) {
          const newSection = await createConfigurationSection({ ...section }, createdConfig.id);
          if (!newSection) throw new Error("Falha ao criar seção");
          createdSections.push(newSection);
        }

        toast.success("Seções criadas com sucesso!");


        for (const { sectionId, itemIds } of sectionItemAssociations) {
          await associateSectionItems({ itemIds }, sectionId, createdConfig.id);
        }

        toast.success("Itens associados às seções!");

        queryClient.invalidateQueries({ queryKey: ["configurations"] });

        return { createdConfig, createdItems, createdSections };
      } catch (error) {
        toast.error("Erro ao processar a configuração.");
        console.error("Erro ao criar configuração:", error);
        throw error;
      }
    },
  });
}
