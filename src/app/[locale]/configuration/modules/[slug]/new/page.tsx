"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Paper, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useConfiguration } from "@/hooks/useConfiguration";
import ConfigurationForm from "../../../configuration/modules/[slug]/new/ConfigurationForm";

const schema = yup.object().shape({
  title: yup.string().required("O título é obrigatório"),
  description: yup.string().optional(),
  type: yup.string().required("O tipo de configuração é obrigatório"),
});

const configurationTypes = [
  { id: "1", name: "Formulário" },
  { id: "2", name: "Workflow" },
  { id: "3", name: "Relatório" },
];

export default function ConfigurationPage() {

  const { dictionary } = useDictionary();
  
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const moduleName = searchParams.get("name");
  const [fields, setFields] = useState<{ name: string; order: number; properties: string }[]>([]);
  const [sections, setSections] = useState<Partial<Section>[]>([]);

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
    },
  });

  const selectedType = watch("type");

  const { mutate: createFullConfig } = useConfiguration();

  const handleCreateConfiguration = (data) => {
    createFullConfig({
      configuration: {
        title: data.title,
        description: data.description,
        configurationTypeId: "fb4069d2-7d91-40ad-ac35-01d1276a2bfc", // ID temp config Type from Swagger
        moduleId,
      },
      items: fields.map(field => ({
        name: field.name,
        order: field.order,
        properties: field.properties,
      })),
      sections: sections.map(section => ({
        name: section.name,
        order: section.order,
        properties: section.properties,
      })),
      sectionItemAssociations: sections.map(section => ({
        sectionId: section.id,
        itemIds: section.items,
      })),
    });
  };

  return (
    <>
    <h1>Teste</h1>
      
    </>
  );
}
