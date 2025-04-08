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
  const dictionary = translations.configuration;
  
  const schema = yup.object().shape({
    name: yup.string().required(dictionary?.modal.validations.nameRequired),
    description: yup.string().optional(),
    metadataSchema: yup.string().required(dictionary?.modal.validations.metadataSchemaRequired),
    dataSchema: yup.string().required(dictionary?.modal.validations.dataSchemaRequired),
  });
  
  const { control, handleSubmit, reset } = useForm<CreateConfigurationType>({
    resolver: yupResolver(schema), 
    mode: "onTouched",
    defaultValues: initialValues || { name: "", description: "", dataSchema:"", metadataSchema:"" }

  });

  const createConfigurationType = useCreateConfigurationType();
  const updateConfigurationType = useUpdateConfigurationType();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(initialValues || { name: "", description: "" });
  }, [initialValues, reset]);

  const onSubmit = async (data: CreateConfigurationType) => {
    setLoading(true);
    try {
      if (initialValues) {
        await updateConfigurationType.mutateAsync({
          id: initialValues.id, 
          data: { ...initialValues, ...data }, 
        });
      } else {
        await createConfigurationType.mutateAsync(data);
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
              label={dictionary?.table.name} 
              fullWidth 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              sx={{ mb: 2 }} />
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
            label={dictionary?.table?.description}
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
            label={dictionary?.table?.dataSchema}
            helperText={fieldState.error?.message} 
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
            label={dictionary?.table?.metadataSchema}
            helperText={fieldState.error?.message} 
          />
          )}     
        />

      <Box sx={{display: 'flex', justifyContent:'flex-end', gap:2}}>
        <Button onClick={handleClose} sx={{minWidth:'110px'}} variant="outlined" color="error">
          {translations?.common?.cancel}
        </Button>
        <Button  data-testid="submit-button"
           sx={{minWidth:'110px'}}  type="submit" variant="contained" color="primary"  disabled={loading}>
          {loading ? translations?.common?.loading : (initialValues ? translations?.common?.editButton : translations?.common?.registerButton)}
        </Button>
      </Box>
     
    </form>
  );
}
