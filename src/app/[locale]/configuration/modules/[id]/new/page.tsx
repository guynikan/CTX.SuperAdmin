"use client";

import { useState } from "react";
import { Box, Typography} from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import ConfigurationForm from "./components/ConfigurationForm";
import { Section } from "@/types/configuration";
import { useConfigurationById } from "@/hooks/useConfiguration";
import { useSearchParams } from "next/navigation";

export default function ConfigurationPage() {

  const searchParams = useSearchParams() 
  const config_id = searchParams.get('config_id')

  const { data: configuration } = useConfigurationById(String(config_id));

  const { dictionary } = useDictionary();
  
  const [fields, setFields] = useState<{ name: string; order: number; properties: string }[]>([]);
  const [sections, setSections] = useState<Partial<Section>[]>([]);


  // const handleCreateConfiguration = () => {
  // };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ textAlign:"left" }}>{dictionary?.newConfiguration}</Typography>   
          {configuration?.title} - {configuration?.configurationType.name}
        </Box>
      
      </Box>
     
      {configuration?.configurationType.name === "Formulário" && (
        <>
          <ConfigurationForm 
            configurationId={config_id}
            fields={fields} 
            setFields={setFields} 
            sections={sections} 
            setSections={setSections}  />
        </>
      )}


    </>
  );
}
