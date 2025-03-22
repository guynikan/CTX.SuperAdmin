"use client";

import { useState } from "react";
import { Paper, Tab, Tabs, Button } from "@mui/material";
import ConfigurationFields from "./ConfigurationFields";
import ConfigurationSections from "./ConfigurationSections";
import { useConfigurationMutations } from "@/hooks/useConfiguration";
import { Item, Section } from "@/types/configuration";
import { toast } from "react-toastify";

type ConfigurationFormProps = {
  configurationId: string;
  fields: Item[];
  setFields: (updatedFields: Item[]) => void;
  sections: Partial<Section>[];
  setSections: (updatedSections: Partial<Section>[]) => void;
};

enum ConfigurationTabs {
  FIELDS = 0,
  SECTIONS = 1,
  RULES = 2,
}

export default function ConfigurationForm({ configurationId, fields, sections, setFields, setSections }: ConfigurationFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { createItemsMutation, createSectionMutation, associateItemsToSectionProcess } = useConfigurationMutations(configurationId);

  const handleSave = async () => {
    try {
      // Cria os novos itens (que ainda não foram persistidos)
      const newItems = fields.filter((item) => !item.isPersisted);
      let createdItems = [];
  
      if (newItems.length > 0) {
        const result = await createItemsMutation.mutateAsync(newItems);
        createdItems = result || [];
  
        // Atualiza o ID e isPersisted dos campos
        const updatedFields = fields.map((field) => {
          const created = createdItems.find((c) => c.name === field.name);
          return created ? { ...created, isPersisted: true } : field;
        });
  
        setFields(updatedFields);
      }
  
      // Atualiza os campos com ids atualizados
      const allFields = [
        ...fields.filter((f) => f.isPersisted),
        ...createdItems.map((f) => ({ ...f, isPersisted: true })),
      ];
  
      // Cria novas seções
      for (const section of sections) {
        if (!section.isPersisted) {
          const created = await createSectionMutation.mutateAsync(section);
          section.id = created.id;
          section.isPersisted = true;
        }
      }
  
      // Atualiza items dentro de seções com os novos IDs reais
      const updatedSections = sections.map((section) => ({
        ...section,
        items: section.items.map((oldId) => {
          const original = fields.find((f) => f.id === oldId);
          const real = allFields.find((f) => f.name === original?.name);
          return real?.id || oldId;
        }),
      }));
  
      setSections(updatedSections);
  
      // Associa os itens às seções
      await Promise.all(
        updatedSections.map((section) => {
          if (!section.id) return;
          const itemIds = section.items;
          if (itemIds.length > 0) {
            return associateItemsToSectionProcess(section.id, itemIds);
          }
        })
      );

      toast.success('Configuração atualizada!');
  
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };
  

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab data-testid="fields-tab" label="CAMPOS" />
        <Tab data-testid="sections-tab" label="SEÇÕES" />
        <Tab data-testid="rules-tab" label="REGRAS" />
      </Tabs>

      {activeTab === ConfigurationTabs.FIELDS && (
        <ConfigurationFields fields={fields} onFieldsChange={setFields} />
      )}
      {activeTab === ConfigurationTabs.SECTIONS && (
        <ConfigurationSections 
          fields={fields} 
          sections={sections} 
          onSectionChange={setSections}  
          onFieldsChange={setFields} 
        />
      )}

      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
        Salvar Configuração
      </Button>
    </Paper>
  );
}
