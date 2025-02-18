import { useCreateSegmentType } from "@/hooks/segments/useSegmentTypes";
import { Modal, Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { CreateSegmentType } from "@/types/segments";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().optional(),
  priority: yup.number().required("Prioridade é obrigatória").min(0, "Deve ser um número positivo"),
});

type Props =  {
  open: boolean;
  onClose: () => void;
}

export default function CreateModal({ open, onClose }: Props) {
  const { control, handleSubmit, reset } = useForm<CreateSegmentType>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "", priority: 0},
  });

  const createSegmentType = useCreateSegmentType();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateSegmentType) => {
    setLoading(true);
    try {
      await createSegmentType.mutateAsync({
        name: data.name,
        description: data.description || "",
        priority: data.priority,
      });
      onClose();
      reset(); 
    } catch (error) {
      console.error("Erro ao criar Segment Type", error);
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
          boxShadow: 24,
          p: 5,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>Criar Segment Type</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Nome" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={{ mb: 2 }} />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Descrição" fullWidth multiline rows={3} sx={{ mb: 2 }} />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Prioridade" type="number" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} sx={{ mb: 2 }} />
            )}
          />

          {/* <Controller
            name="parentModule"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Módulo Pai (opcional)" fullWidth select sx={{ mb: 2 }}>
                <MenuItem value="">Nenhum</MenuItem>
                <MenuItem value="module1">Módulo 1</MenuItem>
                <MenuItem value="module2">Módulo 2</MenuItem>
              </TextField>
            )}
          /> */}

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
