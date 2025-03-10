"use client";

import { useState } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import ConfigurationFields from "./ConfigurationFields";
import ConfigurationSections from "./ConfigurationSections";
import { Section } from "@/types/configuration";

interface FieldItem {
  id: string;
  name: string;
  order: number;
  properties: string;
}

interface ConfigurationFormProps {
  fields: FieldItem[];
  setFields: (updatedFields: FieldItem[]) => void;
  sections: Partial<Section>[];
  setSections: (updatedSections: Partial<Section>[]) => void;
}

export default function ConfigurationForm({ fields, sections, setFields, setSections }: ConfigurationFormProps) {
  const [activeTab, setActiveTab] = useState(0);

  const fieldsAvailable = fields;

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="CAMPOS" />
        <Tab label="SEÇÕES" />
        <Tab label="REGRAS" />
      </Tabs>

      {activeTab === 0 && <ConfigurationFields fields={fields} onFieldsChange={setFields} />}
      {activeTab === 1 && <ConfigurationSections fields={fieldsAvailable} sections={sections}  onFieldsChange={setFields} />}
    </Paper>
  );
}
