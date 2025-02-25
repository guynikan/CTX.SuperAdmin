import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import { useState } from "react";
import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";
import { useCreateSegmentValue } from "@/hooks/segments/useSegmentValues";
import { CreateSegmentValue } from "@/types/segments";
import { useDictionary } from "@/i18n/DictionaryProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: Props) {

  const { dictionary  } = useDictionary();

  const schema = yup.object().shape({
    segmentTypeId: yup.string().required(dictionary?.values.modal.validations.segmentTypeRequired),
    displayName: yup.string().required(dictionary?.values.modal.validations?.displayNameRequired),
    value: yup.string().required(dictionary?.values.modal.validations?.valueRequired),
    description: yup.string().optional(),
  });

  const { control, handleSubmit, reset } = useForm<CreateSegmentValue>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      segmentTypeId: "",
      displayName: "",
      value: "",
    }
  });

  const createSegmentValue = useCreateSegmentValue();
  const { data: segmentTypes = [], isLoading } = useSegmentTypes();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateSegmentValue) => {
    setLoading(true);
    try {
      await createSegmentValue.mutateAsync({
        segmentTypeId: data.segmentTypeId,
        displayName: data.displayName,
        value: data.value,
        description: data.description || "",
      });
      toast.success(dictionary?.values.modal.successMessage);
      onClose();
      reset();
    } catch (error) {
      toast.error(dictionary?.values.modal.errorMessage);
      console.error("Erro ao criar Segment Value", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderTop: "5px solid #333",
          boxShadow: 20,
          p: 5,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
         {dictionary?.values.modal.title}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="segmentTypeId"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth sx={{ mb: 2 }} error={!!fieldState.error}>
                <InputLabel id="segment-type-label"> {dictionary?.values.modal.segmentTypeLabel} </InputLabel>
                <Select labelId="segment-type-label" {...field} label={dictionary?.values.modal.segmentTypeLabel}>
                  {isLoading ? <MenuItem disabled>{dictionary?.loading}</MenuItem> : segmentTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && <Typography ml={2} sx={{fontSize:'11px'}} color="error">{fieldState.error.message}</Typography>}
              </FormControl>
            )}
          />

          <Controller
            name="displayName"
            control={control}
            render={({ field, fieldState }) => (

            <TextField
              {...field}
              sx={{ mb: 2 }} 
              fullWidth error={!!fieldState.error}
              label={dictionary?.values.modal.displayNameLabel}
              placeholder={dictionary?.values.modal.displayNamePlaceholder}
              helperText={fieldState.error?.message} 
            />
            )}
          />

          <Controller
            name="value"
            control={control}
            render={({ field, fieldState }) => (
              <TextField 
                {...field} 
                label={dictionary?.values.modal.valueLabel}
                fullWidth 
                error={!!fieldState.error} 
                helperText={fieldState.error?.message} 
                sx={{ mb: 2 }} />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field} 
                label="Description" 
                fullWidth 
                multiline 
                rows={3} 
                sx={{ mb: 2 }} />
            )}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? dictionary?.values.modal.loadingButton : dictionary?.values.modal.submitButton}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
