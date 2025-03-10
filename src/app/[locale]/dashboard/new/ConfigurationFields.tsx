"use client";

import { useState } from "react";
import {
  Paper, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Modal
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import { useForm, Controller } from "react-hook-form";
import { Section } from "@/types/configuration";
import ConfigurationSections from "./ConfigurationSections";

interface FieldItem {
  name: string;
  order: number;
  properties: string;
}

interface ConfigurationFieldsProps {
  selectedType: string;
  fields: FieldItem[];
  onFieldsChange: (updatedFields: FieldItem[]) => void;
}

const fieldTypes = ["Text", "Number Text", "Phone Text", "Textarea", "Select", "Datepicker", "Radio", "Checkbox"];

const fieldSizes = [
  { label: "1/3", value: "1/3" },
  { label: "50%", value: "50%" },
  { label: "100%", value: "100%" },
];

export default function ConfigurationFields({ selectedType, fields, onFieldsChange }: ConfigurationFieldsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sections, setSections] = useState<Partial<Section>[]>([]);


  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: "", type: "Text", size: "1/1" },
  });

  const handleAddSection = () => {
    const newSection: Partial<Section> = {
      id: crypto.randomUUID(),
      name: `Seção ${sections.length + 1}`,
      items: [],
    };
    setSections([...sections, newSection]);
  };

  const handleAddField = (data: { name: string; type: string; size: string }) => {
    const updatedFields = editingIndex !== null
      ? fields.map((field, index) =>
          index === editingIndex ? { ...field, name: data.name, properties: JSON.stringify({ type: data.type, size: data.size }) } : field
        )
      : [...fields, { id: crypto.randomUUID(), name: data.name, order: fields.length, properties: JSON.stringify({ type: data.type, size: data.size }) }];

    onFieldsChange(updatedFields);
    handleClose();
  };

  const handleEdit = (index: number) => {
    const field = fields[index];
    const props = JSON.parse(field.properties);
    setEditingIndex(index);
    reset({ name: field.name, type: props.type, size: props.size });
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    reset({ name: "", type: "Text", size: "1/1" });
    setEditingIndex(null);
  };

  if (selectedType !== "1") return null; 


  const handleDrop = (fieldId: string, sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...new Set([...section.items, fieldId])] }
          : section
      )
    );
  };

  const DraggableField = ({ field }: { field: FieldItem }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: field.id, // Ensure ID is set
      data: { field },
    });
  
    return (
      <Paper
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{ p: 1, mb: 1, cursor: "grab", backgroundColor: "#f5f5f5" }}
      >
        {field.name}
      </Paper>
    );
  };
  
  const DroppableSection = ({ section }: { section: Section }) => {
    const { setNodeRef } = useDroppable({
      id: section.id, // Unique droppable ID
    });
  
    return (
      <Paper ref={setNodeRef} sx={{ p: 2, mb: 2, minHeight: 100, backgroundColor: "white", border:'1px solid #ccc' }}>
        <Typography variant="subtitle1" fontWeight="bold">{section.name}</Typography>
        {section?.items && section.items.length > 0 ? (
          section.items.map((fieldId) => {
            const field = fields.find((f) => f.id === fieldId);
            return field ? (
              <Paper key={field.id} sx={{ p: 1, mt: 1, backgroundColor: "#f5f5f5" }}>{field.name}</Paper>
            ) : null;
          })
        ) : (
          <Typography variant="body2" sx={{ color: "#757575", mt: 1 }}>Arraste campos aqui</Typography>
        )}
      </Paper>
    );
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <Tab label="CAMPOS" />
        <Tab label="SEÇÕES" />
        <Tab label="REGRAS" />
      </Tabs>

      {activeTab === 0 && (
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
                    const props = JSON.parse(field.properties);
                    return (
                      <TableRow key={index}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{props.type}</TableCell>
                        <TableCell>{props.size}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(index)}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDelete(index)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum campo adicionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2,}}
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Novo Campo
          </Button>          
        </>
      )}
      
      {activeTab === 1 && <ConfigurationSections fields={fields} onFieldsChange={onFieldsChange} />}


      {/* MUI Modal for Adding/Editing Fields */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}>
          <Typography variant="h6" mb={2}>{editingIndex !== null ? "Editar Campo" : "Novo Campo"}</Typography>
          <form onSubmit={handleSubmit(handleAddField)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextField {...field} label="Nome do Campo" fullWidth margin="dense" required />}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense">
                  <InputLabel>Tipo do Campo</InputLabel>
                  <Select {...field}>
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
                  <Select {...field}>
                    {fieldSizes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleClose} color="secondary" sx={{ mr: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Paper>
  );
}
