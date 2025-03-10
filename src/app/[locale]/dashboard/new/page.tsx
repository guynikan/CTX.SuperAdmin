"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Paper, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useConfiguration } from "@/hooks/useConfiguration";
import ConfigurationFields from "./ConfigurationFields";

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
      description:data.description,
      configurationTypeId: "fb4069d2-7d91-40ad-ac35-01d1276a2bfc", // ID temp config Type from Swagger
      moduleId,
    },
    items: fields.map(field => ({
      name: field.name,
      order: field.order,
      properties: field.properties, 
    })),
    sections: [
      { name: "Seção 1", order: 1, properties: "{}" },
      { name: "Seção 2", order: 2, properties: "{}" },
    ],
    sectionItemAssociations: [
      { sectionId: "sec1", itemIds: ["itemA", "itemB"] },
    ],
  });
};

  return (
    <>
   
     <form onSubmit={handleSubmit(handleCreateConfiguration)}>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#757575" }}>{moduleName} </Typography>
          </Box>  
          <Typography variant="h6" mt={1}>{dictionary?.newConfiguration}</Typography>

            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Título" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Descrição (opcional)" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                  <InputLabel>Tipo de Configuração</InputLabel>
                  <Select {...field} label="Tipo de Configuração">
                    {configurationTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
        </Paper>

        <ConfigurationFields fields={fields} onFieldsChange={setFields} selectedType={selectedType} />

        <Button variant="contained" color="primary" type="submit" sx={{ maxWidth:'200px', mt: 2 }}>Salvar</Button>

     </form>
    </>
  );
}
