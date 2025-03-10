"use client";

import { useState } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import ConfigurationFields from "./ConfigurationFields";
import ConfigurationSections from "./ConfigurationSections";
import { Item, Section } from "@/types/configuration";

type ConfigurationFormProps =  {
  fields: Item[];
  setFields: (updatedFields: Item[]) => void;
  sections: Partial<Section>[];
  setSections: (updatedSections: Partial<Section>[]) => void;
}

enum ConfigurationTabs {
  FIELDS = 0,
  SECTIONS = 1,
  RULES = 2,
}

export default function ConfigurationForm({ fields, sections, setFields, setSections }: ConfigurationFormProps) {
  const [activeTab, setActiveTab] = useState(0);

  const assignedFieldIds = sections.flatMap((section) => section.items);
  const fieldsAvailable = fields.filter((field) => !assignedFieldIds.includes(field.id));


  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="CAMPOS" />
        <Tab label="SEÇÕES" />
        <Tab label="REGRAS" />
      </Tabs>

      {activeTab === ConfigurationTabs.FIELDS && 
        <ConfigurationFields fields={fieldsAvailable} onFieldsChange={setFields} />}
      {activeTab === ConfigurationTabs.SECTIONS && 
        <ConfigurationSections 
          fields={fields} 
          sections={sections} 
          onSectionChange={setSections}  
          onFieldsChange={setFields} />}
    </Paper>
  );
}
