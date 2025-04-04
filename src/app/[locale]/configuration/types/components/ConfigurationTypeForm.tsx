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
  const { dictionary } = useDictionary();

  const schema = yup.object().shape({
    name: yup.string().required(dictionary?.configuration?.modal.validations.nameRequired),
    description: yup.string().optional(),
  });
  
  const { control, handleSubmit, reset } = useForm<CreateConfigurationType>({
    resolver: yupResolver(schema), 
    mode: "onTouched",
    defaultValues: initialValues || { name: "", description: ""  }

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
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              label={dictionary?.configuration?.table.name} 
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
            label={dictionary?.configuration?.table?.description}
            helperText={fieldState.error?.message} 
          />
          )}     
        />

      <Box sx={{display: 'flex', justifyContent:'flex-end', gap:2}}>
        <Button sx={{minWidth:'110px'}}  type="submit" variant="outlined" color="error">
          Cancel
        </Button>
        <Button sx={{minWidth:'110px'}}  type="submit" variant="contained" color="primary"  disabled={loading}>
          {loading ? dictionary?.common?.loading : (initialValues ? dictionary?.common?.editButton : dictionary?.common?.registerButton)}
        </Button>
      </Box>
     
    </form>
  );
}
