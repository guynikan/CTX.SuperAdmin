"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

type ModuleFormData = {
  name: string;
  description?: string;
  parentId?: string; 
};

interface CreateModuleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => void;
  parentId?: string; 
  moduleData: {
    name: string;
    description: string;
  };
  setModuleData: (data: { name: string; description: string }) => void;
  loading: boolean;
}

// 📌 Validação Yup
const schema = yup.object().shape({
  name: yup.string().trim().required("O nome do módulo é obrigatório"),
  description: yup.string().optional(),
  parentId: yup.string().optional(), 
});

export default function CreateModuleModal({ open, onClose, onSubmit, moduleData, setModuleData, parentId, loading }: CreateModuleModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", description: "", parentId: parentId || undefined },
  });

  const handleClose = () => {
    reset(); // Resetar os campos ao fechar
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
        <Typography variant="h6">
          {parentId ? "Adicionar Novo Submódulo" : "Adicionar Novo Módulo"}
        </Typography>

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
            <TextField {...field} label="Descrição" fullWidth margin="dense" multiline rows={3} />
          )}
        />

        {/* ID do Módulo Pai (oculto, apenas se for submódulo) */}
        {parentId && <input type="hidden" value={parentId} {...control.register("parentId")} />}

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
