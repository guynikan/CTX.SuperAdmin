import { Modal, Box, Typography} from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";
import SegmentValueForm from "./SegmentValueForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: Props) {

  const { dictionary  } = useDictionary();

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
          { dictionary?.values.modal.titleCreate}
        </Typography>

        {/* <form onSubmit={handleSubmit(onSubmit)}>
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
        </form> */}

        <SegmentValueForm  />

      </Box>
    </Modal>
  );
}
