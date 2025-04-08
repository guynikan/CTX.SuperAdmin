"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button, Box } from "@mui/material";
import { CreateConfiguration } from "@/types/configuration";
import { useConfigurationTypes } from "@/hooks/useConfiguration";
import { useDictionary } from "@/i18n/DictionaryProvider";

const schema = yup.object().shape({
  title: yup.string().required("O título é obrigatório"),
  description: yup.string().optional(),
  configurationTypeId: yup.string().required("O tipo de configuração é obrigatório"),
});

type ConfigurationModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConfiguration) => void;
  initialData?: Partial<CreateConfiguration>;
};

export default function CreateConfigurationModal({ open, onClose, onSubmit, initialData }: ConfigurationModalProps) {
  
  const { dictionary: translations } = useDictionary();
  const dictionary = translations.modules;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Partial<CreateConfiguration>>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: "",
      description: "",
      configurationTypeId: "",
    },
  });

  const { data: configurationTypes } = useConfigurationTypes();
  
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalContainer}>
        <Typography variant="h6">{dictionary?.newConfiguration}</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Título" fullWidth margin="normal" error={!!errors.title} helperText={errors.title?.message} />
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
            name="configurationTypeId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={styles.formControl} error={!!errors.configurationTypeId}>
                <InputLabel>Tipo de Configuração</InputLabel>
                <Select {...field} label="Tipo de Configuração">
                  {configurationTypes?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box sx={styles.buttonContainer}>
            <Button onClick={handleClose} color="error" sx={styles.cancelButton}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

const styles = {
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 950,
    width: "90%",
    bgcolor: "background.paper",
    borderTop: "5px solid #333",
    boxShadow: 20,
    p: 5,
    borderRadius: 1,
  },
  formControl: {
    fullWidth: true,
    margin: "15px 0",
  },
  buttonContainer: {
    mt: 2,
    display: "flex",
    justifyContent: "flex-end",
  },
  cancelButton: {
    mr: 1,
  },
};