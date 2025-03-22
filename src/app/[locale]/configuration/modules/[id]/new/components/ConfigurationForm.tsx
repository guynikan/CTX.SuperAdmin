"use client";

import { useState } from "react";
import { Paper, Tab, Tabs, Button } from "@mui/material";
import ConfigurationFields from "./ConfigurationFields";
import ConfigurationSections from "./ConfigurationSections";
import { useConfigurationMutations } from "@/hooks/useConfiguration";
import { Item, Section } from "@/types/configuration";

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

  const assignedFieldIds = sections.flatMap((section) => section.items);
  const fieldsAvailable = fields.filter((field) => !assignedFieldIds.includes(field.id));

  const handleSave = async () => {
    try {
      // Criar os campos
      await createItemsMutation.mutateAsync(fields);
      
      // Criar as seções
      await Promise.all(
        sections.map(async (section) => {
          if (!section.id) {
            const createdSection = await createSectionMutation.mutateAsync(section);
            section.id = createdSection.id;
          }
        })
      );

      // Associar os campos às seções
      await Promise.all(
        sections.map((section) => {
          if (section.id && section.items.length > 0) {
            return associateItemsToSectionProcess(section.id, section.items.map(item => item.id));
          }
        })
      );
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="CAMPOS" />
        <Tab label="SEÇÕES" />
        <Tab label="REGRAS" />
      </Tabs>

      {activeTab === ConfigurationTabs.FIELDS && (
        <ConfigurationFields fields={fieldsAvailable} onFieldsChange={setFields} />
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
