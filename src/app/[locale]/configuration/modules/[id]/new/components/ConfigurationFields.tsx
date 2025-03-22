"use client";

import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { Item } from "@/types/configuration";

type ConfigurationFieldsProps = {
  fields: Item[];
  onFieldsChange: (updatedFields: Item[]) => void;
};

const fieldTypes = ["Text", "Number", "Phone", "Textarea", "Select", "Date", "Radio", "Checkbox"];
const fieldSizes = ["1/3", "50%", "100%"];

export default function ConfigurationFields({ fields, onFieldsChange }: ConfigurationFieldsProps) {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: "", type: "Text", size: "100%" },
  });

  const handleAddField = (data: { name: string; type: string; size: string }) => {
    const newField: Item = {
      id: crypto.randomUUID(),
      name: data.name,
      order: fields.length,
      properties: JSON.stringify({ type: data.type, size: data.size }),
    };

    const updatedFields =
      editingIndex !== null
        ? fields.map((field, index) => (index === editingIndex ? { ...newField, id: field.id } : field))
        : [...fields, newField];

    onFieldsChange(updatedFields);
    handleClose();
  };

  const handleEdit = (index: number) => {
    const field = fields[index];
    const props = JSON.parse(field.properties || "{}");
    setEditingIndex(index);
    reset({ name: field.name, type: props.type || "Text", size: props.size || "100%" });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    onFieldsChange(fields.filter((field) => field.id !== id));
  };

  const handleClose = () => {
    setOpen(false);
    reset({ name: "", type: "Text", size: "100%" });
    setEditingIndex(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Tamanho</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.length > 0 ? (
              fields.map((field, index) => {
                const props = JSON.parse(field.properties || "{}");
                return (
                  <TableRow key={field.id}>
                    <TableCell>{field.name}</TableCell>
                    <TableCell>{props.type || "N/A"}</TableCell>
                    <TableCell>{props.size || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(field.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum campo adicionado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Novo Campo
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingIndex !== null ? "Editar Campo" : "Novo Campo"}
          </Typography>
          <form onSubmit={handleSubmit(handleAddField)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextField {...field} label="Nome" fullWidth required />}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense">
                  <InputLabel>Tipo</InputLabel>
                  <Select {...field} label="Tipo">
                    {fieldTypes.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense">
                  <InputLabel>Tamanho</InputLabel>
                  <Select {...field} label="Tamanho">
                    {fieldSizes.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleClose} color="secondary" sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
