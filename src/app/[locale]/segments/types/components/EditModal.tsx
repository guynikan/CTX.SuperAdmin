import { useUpdateSegmentType } from "@/hooks/segments/useSegmentTypes";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { SegmentType } from "@/types/segments";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().optional(),
  priority: yup.number().required("Prioridade é obrigatória").min(0, "Deve ser um número positivo"),
});

type Props = {
  open: boolean;
  onClose: () => void;
  segment: SegmentType | null; // O item a ser editado
};

export default function EditModal({ open, onClose, segment }: Props) {
  const { control, handleSubmit, reset } = useForm<SegmentType>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "", priority: 0 }, // Inicializa vazio
  });

  const updateSegmentType = useUpdateSegmentType();
  const [loading, setLoading] = useState(false);

  // Quando um `segment` for passado, preenche o formulário com os dados
  useEffect(() => {
    if (segment) {
      reset({
        name: segment.name,
        description: segment.description,
        priority: segment.priority,
      });
    }
  }, [segment, reset]);

  const onSubmit = async (data: SegmentType) => {
    if (!segment) return;

    setLoading(true);
    try {
      await updateSegmentType.mutateAsync({
        id: segment.id,
        values: {
          name: data.name,
          description: data.description || "",
          priority: data.priority,
        },
      });
      onClose();
    } catch (error) {
      console.error("Erro ao editar Segment Type", error);
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
        <Typography variant="h6" mb={2}>Editar Segment Type</Typography>

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

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
