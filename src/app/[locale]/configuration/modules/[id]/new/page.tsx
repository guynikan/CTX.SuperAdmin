"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography} from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import ConfigurationForm from "./components/ConfigurationForm";
import { Item, Section } from "@/types/configuration";
import { useConfigurationById } from "@/hooks/useConfiguration";
import { useSearchParams } from "next/navigation";

export default function ConfigurationPage() {

  const searchParams = useSearchParams() 
  const config_id = useMemo(() => searchParams.get("config_id") || "", [searchParams]);

  const { data: configuration } = useConfigurationById(String(config_id));

  const { dictionary } = useDictionary();
  
  const [fields, setFields] = useState<{ name: string; order: number; properties: string }[]>([]);
  const [sections, setSections] = useState<Partial<Section>[]>([]);

  console.log({configuration})

  useEffect(() => {
    if (configuration) {
      const transformedFields: Item[] = (configuration.items || []).map((item) => ({
        ...item,
        isPersisted: true, 
      }));

      const transformedSections: Partial<Section>[] = (configuration.sections || []).map((section) => ({
        ...section,
        isPersisted: true,
        items: section.items || [],
      }));

      setFields(transformedFields);
      setSections(transformedSections);
    }
  }, [configuration]);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ textAlign:"left" }}>{dictionary?.newConfiguration}</Typography>   
          {configuration?.title} - {configuration?.description}
        </Box>
      
      </Box>
      {configuration?.configurationTypeId === "49386185-8f48-42cd-acd4-78dcf7c8a56d" && (
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
