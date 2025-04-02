import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState, useEffect } from "react";
import { useCreateSegmentType, useUpdateSegmentType } from "@/hooks/segments/useSegmentTypes";
import { CreateSegmentType, SegmentType } from "@/types/segments";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { Button, TextField } from "@mui/material";

type Props = {
  initialValues?: SegmentType; 
  onClose: () => void;
};

export default function SegmentTypeForm({ initialValues, onClose }: Props) {
  const { dictionary: translations  } = useDictionary();
  const dictionary = translations.segments;
  
  const schema = yup.object().shape({
    name: yup.string().required(dictionary?.types?.modal.validations.nameRequired),
    description: yup.string().optional(),
    priority: yup.number().required(dictionary?.types?.modal.validations.priorityRequired).min(0),
  });
  
  const { control, handleSubmit, reset } = useForm<CreateSegmentType>({
    resolver: yupResolver(schema), 
    mode: "onTouched",
    defaultValues: initialValues || { name: "", description: "", priority: 0,  }

  });

  const createSegmentType = useCreateSegmentType();
  const updateSegmentType = useUpdateSegmentType();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(initialValues || { name: "", description: "", priority: 0 });
  }, [initialValues, reset]);

  const onSubmit = async (data: CreateSegmentType) => {
    setLoading(true);
    try {
      if (initialValues) {
        await updateSegmentType.mutateAsync({
          id: initialValues.id, 
          data: { ...initialValues, ...data }, 
        });
      } else {
        await createSegmentType.mutateAsync(data);
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
              label={dictionary?.types.modal.nameLabel} 
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
            label={dictionary?.types.modal.descriptionLabel}
            helperText={fieldState.error?.message} 
          />
          )}     
        />

        <Controller
          name="priority"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              label={dictionary?.types.modal.priorityLabel}
              type="number" 
              fullWidth 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
              sx={{ mb: 2 }} />
          )}
        />

      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? dictionary?.types.modal.loadingButton : (initialValues ? dictionary?.values.modal.editButton : dictionary?.values.modal.submitButton)}
      </Button>
    </form>
  );
}
