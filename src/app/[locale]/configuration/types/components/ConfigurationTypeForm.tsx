import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState, useEffect } from "react";
import { useCreateConfigurationType, useUpdateConfigurationType } from "@/hooks/useConfigurationTypes";
import { CreateConfigurationType, ConfigurationType } from "@/types/configuration";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { Box, Button, TextField } from "@mui/material";

type Props = {
  initialValues?: ConfigurationType; 
  onClose: () => void;
};

export default function ConfigurationTypeForm({ initialValues, onClose }: Props) {
  const { dictionary: translations } = useDictionary();
  const dictionary = translations.configuration as any;
  const commonTranslations = translations.common as any;
  
  // Default valid JSON schemas that accept any structure
  const defaultDataSchema = JSON.stringify({
    "type": "object",
    "properties": {},
    "additionalProperties": true
  }, null, 2);
  
  const defaultMetadataSchema = JSON.stringify({
    "type": "object",
    "properties": {},
    "additionalProperties": true
  }, null, 2);

  const validateJsonSchema = (value: string) => {
    if (!value) return false;
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  };

  const schema = yup.object().shape({
    name: yup.string().required(dictionary?.modal?.validations?.nameRequired || "Nome é obrigatório"),
    slug: yup.string()
      .required(dictionary?.modal?.validations?.slugRequired || "Slug é obrigatório")
      .matches(/^[a-z0-9_]+$/, dictionary?.modal?.validations?.slugInvalid || "Slug inválido"),
    description: yup.string().optional(),
    metadataSchema: yup.string()
      .required(dictionary?.modal?.validations?.metadataSchemaRequired || "Metadata Schema é obrigatório")
      .test('is-valid-json', 'Deve ser um JSON válido', validateJsonSchema),
    dataSchema: yup.string()
      .required(dictionary?.modal?.validations?.dataSchemaRequired || "Data Schema é obrigatório")
      .test('is-valid-json', 'Deve ser um JSON válido', validateJsonSchema),
  });
  
  const { control, handleSubmit, reset } = useForm<{
    name: string;
    slug: string;
    description?: string;
    dataSchema: string;
    metadataSchema: string;
  }>({
    resolver: yupResolver(schema), 
    mode: "onTouched",
    defaultValues: initialValues ? {
      name: initialValues.name || "",
      slug: initialValues.slug || "", 
      description: initialValues.description || "",
      dataSchema: initialValues.dataSchema || defaultDataSchema,
      metadataSchema: initialValues.metadataSchema || defaultMetadataSchema
    } : { 
      name: "", 
      slug: "", 
      description: "", 
      dataSchema: defaultDataSchema, 
      metadataSchema: defaultMetadataSchema 
    }

  });

  const createConfigurationType = useCreateConfigurationType();
  const updateConfigurationType = useUpdateConfigurationType();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(initialValues ? {
      name: initialValues.name || "",
      slug: initialValues.slug || "",
      description: initialValues.description || "",
      dataSchema: initialValues.dataSchema || defaultDataSchema,
      metadataSchema: initialValues.metadataSchema || defaultMetadataSchema
    } : { 
      name: "", 
      slug: "", 
      description: "", 
      dataSchema: defaultDataSchema, 
      metadataSchema: defaultMetadataSchema 
    });
  }, [initialValues, reset]);

  const onSubmit = async (data: {
    name: string;
    slug: string;
    description?: string;
    dataSchema: string;
    metadataSchema: string;
  }) => {
    setLoading(true);
    try {
      // Parse JSON schemas to ensure they are sent as objects, not strings
      const processedData = {
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        dataSchema: JSON.parse(data.dataSchema),
        metadataSchema: JSON.parse(data.metadataSchema)
      };
      
      if (initialValues) {
        await updateConfigurationType.mutateAsync({
          id: initialValues.id, 
          data: { ...initialValues, ...processedData }, 
        });
      } else {
        await createConfigurationType.mutateAsync(processedData);
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              label={dictionary?.table?.name || "Nome"} 
              fullWidth 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              sx={{ mb: 2 }} />
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={dictionary?.table?.slug || "Slug"}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message || "Use apenas letras minúsculas, números e underscore"}
              sx={{ mb: 2 }}
              placeholder="exemplo_tipo_configuracao"
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
            {...field}
            sx={{ mb: 2 }} 
            fullWidth 
            multiline
            rows={3}
            error={!!fieldState.error}
            label={dictionary?.table?.description || "Descrição"}
            helperText={fieldState.error?.message} 
          />
          )}     
        />

        <Controller
          name="dataSchema"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
            {...field}
            sx={{ mb: 2 }} 
            fullWidth 
            multiline
            rows={3}
            error={!!fieldState.error}
            label={dictionary?.table?.dataSchema || "Data Schema"}
            helperText={fieldState.error?.message || "JSON Schema válido que define a estrutura dos dados"}
            placeholder={defaultDataSchema} 
          />
          )}     
                />
        <Controller
          name="metadataSchema"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
            {...field}
            sx={{ mb: 2 }} 
            fullWidth 
            multiline
            rows={3}
            error={!!fieldState.error}
            label={dictionary?.table?.metadataSchema || "Metadata Schema"}
            helperText={fieldState.error?.message || "JSON Schema válido que define a estrutura dos metadados"}
            placeholder={defaultMetadataSchema} 
          />
          )}     
        />

      <Box sx={{display: 'flex', justifyContent:'flex-end', gap:2}}>
        <Button onClick={handleClose} sx={{minWidth:'110px'}} variant="outlined" color="error">
          {commonTranslations?.cancel || "Cancelar"}
        </Button>
        <Button  data-testid="submit-button"
           sx={{minWidth:'110px'}}  type="submit" variant="contained" color="primary"  disabled={loading}>
          {loading ? (commonTranslations?.loading || "Carregando...") : (initialValues ? (commonTranslations?.editButton || "Editar") : (commonTranslations?.registerButton || "Cadastrar"))}
        </Button>
      </Box>
     
    </form>
  );
}
