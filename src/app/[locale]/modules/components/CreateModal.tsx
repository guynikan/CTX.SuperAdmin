"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const styles = {
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    borderTop: "5px solid #333",
    boxShadow: 20,
    p: 5,
    borderRadius: 1,
  },
  buttonContainer: {
    mt: 3,
    display: "flex",
    justifyContent: "flex-end",
  },
};

type ModuleFormData = {
  name: string;
  description?: string;
  parentId?: string;
};

type CreateModuleModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => void;
  parentId?: string;
  loading: boolean;
};

const schema = yup.object({
  name: yup.string().trim().required("O nome do módulo é obrigatório"),
  description: yup.string().optional(),
  parentId: yup.string().optional(),
});

export default function CreateModuleModal({
  open,
  onClose,
  onSubmit,
  parentId,
  loading,
}: CreateModuleModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      parentId: parentId || undefined,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="module-modal-title">
      <Box sx={styles.modalContainer}>
        <Typography variant="h6" id="module-modal-title" sx={{ mb: 2 }}>
          {parentId ? "Adicionar Novo Submódulo" : "Adicionar Novo Módulo"}
        </Typography>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset(); 
          })}
        >
          {/* Nome do Módulo */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome"
                fullWidth
                margin="dense"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Descrição do Módulo */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição (opcional)"
                fullWidth
                margin="dense"
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          {/* ID do Módulo Pai (oculto, apenas se for submódulo) */}
          {parentId && <input type="hidden" value={parentId} {...control.register("parentId")} />}

          <Box sx={styles.buttonContainer}>
            <Button onClick={handleClose} color="error" sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Criando..." : "Adicionar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
