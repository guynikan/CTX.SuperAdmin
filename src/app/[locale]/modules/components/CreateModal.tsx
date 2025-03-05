"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

type ModuleFormData = {
  name: string;
  description?: string;
};
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => void;
  loading: boolean;
}

const schema = yup.object().shape({
  name: yup.string().trim().required("O nome do módulo é obrigatório"),
  description: yup.string().optional(),
});

export default function CreateModal({ open, onClose, onSubmit, loading }: CreateModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", description: "" },
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
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
        }}
      >
        <Typography variant="h6">Adicionar Novo Módulo</Typography>

        {/* Nome do módulo */}
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

        {/* Descrição do módulo */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Descrição" fullWidth margin="dense" multiline rows={3} />
          )}
        />

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} color="error" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="outlined" color="primary" disabled={loading} onClick={handleSubmit(onSubmit)}>
            {loading ? "Criando..." : "Adicionar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
