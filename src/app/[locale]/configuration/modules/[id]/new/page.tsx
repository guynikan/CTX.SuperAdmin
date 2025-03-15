"use client";

import { useState } from "react";
import { Box, Typography} from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import ConfigurationForm from "./components/ConfigurationForm";
import { Section } from "@/types/configuration";

export default function ConfigurationPage() {

  const { dictionary } = useDictionary();
  
  const [fields, setFields] = useState<{ name: string; order: number; properties: string }[]>([]);
  const [sections, setSections] = useState<Partial<Section>[]>([]);

  const selectedType = "1";

  // const handleCreateConfiguration = () => {
  // };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ textAlign:"left" }}>{dictionary?.newConfiguration}</Typography>   
        </Box>
      
      </Box>
     
      {selectedType === "1" && (
        <>
          <ConfigurationForm 
            fields={fields} 
            setFields={setFields} 
            sections={sections} 
            setSections={setSections}  />
        </>
      )}


    </>
  );
}
