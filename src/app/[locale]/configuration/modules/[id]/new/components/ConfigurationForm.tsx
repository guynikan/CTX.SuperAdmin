"use client";

import { useState } from "react";
import { Paper, Tab, Tabs, Button, Box } from "@mui/material";
import ConfigurationFields from "./ConfigurationFields";
import ConfigurationSections from "./ConfigurationSections";
import { useConfigurationMutations } from "@/hooks/useConfiguration";
import { Item, Section } from "@/types/configuration";
import { toast } from "react-toastify";
import ConfigurationRules from "./ConfigurationRules";

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
  const [ruleset, setRuleset] = useState({
    name: "Minha Regra",
    enabled: true,
    priority: 0,
    ruleConditions: [],
  });

  const { createItemsMutation, createSectionMutation, associateItemsToSectionProcess, createRuleSetMutation } = useConfigurationMutations(configurationId);
  

  const persistNewFields = async () => {
    const newItems = fields.filter((item) => !item.isPersisted);
    if (newItems.length === 0) return;
  
    const created = await createItemsMutation.mutateAsync(newItems);
    const updated = fields.map((field) => {
      const match = created?.find((c) => c.name === field.name);
      return match ? { ...match, isPersisted: true } : field;
    });
  
    setFields(updated);
  };
  
  const buildAllFields = (): Item[] => {
    const persisted = fields.filter((f) => f.isPersisted);
    const newOnes = fields.filter((f) => !f.isPersisted);
    return [...persisted, ...newOnes];
  };
  
  const persistSectionsWithRealItemIds = async (allFields: Item[]): Promise<Partial<Section>[]> => {
    const updated = [...sections];
  
    for (const section of updated) {
      if (!section.isPersisted) {
        const created = await createSectionMutation.mutateAsync(section);
        section.id = created?.id;
        section.isPersisted = true;
      }
  
      section.items = section.items?.map((oldId) => {
        const original = fields.find((f) => f.id === oldId);
        const real = allFields.find((f) => f.name === original?.name);
        return real?.id || oldId;
      });
    }
  
    return updated;
  };
  
  const associateItemsToSections = async (updatedSections: Partial<Section>[]) => {
    await Promise.all(
      updatedSections.map((section) => {
        if (!section.id) return;
        const itemIds = section.items || [];
        if (itemIds.length > 0) {
          return associateItemsToSectionProcess(section.id, itemIds);
        }
      })
    );
  };

  const handleSave = async () => {
    try {
      if (fields.length > 0) await persistNewFields();
      const allFields = buildAllFields();
  
      if (sections.length > 0) {
        const updated = await persistSectionsWithRealItemIds(allFields);
        setSections(updated);
        await associateItemsToSections(updated);
      }
  
      if (ruleset) {
        await createRuleSetMutation.mutateAsync(ruleset);
      }
  
      toast.success("Configuração atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração.");
    }
  };
  

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab data-testid="fields-tab" label="CAMPOS" />
        <Tab data-testid="sections-tab" label="SEÇÕES" />
        <Tab data-testid="rules-tab" label="REGRAS" />
      </Tabs>

      <Box hidden={activeTab !== ConfigurationTabs.FIELDS}>
        <ConfigurationFields fields={fields} onFieldsChange={setFields} />
      </Box>

      <Box hidden={activeTab !== ConfigurationTabs.SECTIONS}>
        <ConfigurationSections
          fields={fields}
          sections={sections}
          onSectionChange={setSections}
          onFieldsChange={setFields}
        />
      </Box>

      <Box hidden={activeTab !== ConfigurationTabs.RULES}>
        <ConfigurationRules ruleset={ruleset} onChange={setRuleset} />
      </Box>

      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
        Salvar Configuração
      </Button>
    </Paper>
  );
}
