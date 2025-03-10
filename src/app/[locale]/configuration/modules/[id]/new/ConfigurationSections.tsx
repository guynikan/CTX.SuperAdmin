"use client";

import { useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Grid from "@mui/material/Grid2";
import { Section } from "@/types/configuration";

interface FieldItem {
  id: string;
  name: string;
  order: number;
  properties: string;
}

interface ConfigurationSectionsProps {
  sections: Partial<Section>[];
  fields: FieldItem[];
  onFieldsChange: (updatedFields: FieldItem[]) => void;
  onSectionChange: (updatedSections: Partial<Section>[]) => void;
}

export default function ConfigurationSections({
  fields,
  sections,
  onFieldsChange,
  onSectionChange,
}: ConfigurationSectionsProps) {
  
  const handleAddSection = () => {
    const newSection: Partial<Section> = {
      id: crypto.randomUUID(),
      name: `Seção ${sections.length + 1}`,
      items: [],
    };
    onSectionChange([...sections, newSection]);
  };

  const handleDrop = (fieldId: string, sectionId: string) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, items: [...new Set([...(section.items || []), fieldId])] }
        : section
    );

    // Atualiza os campos removendo apenas aqueles que foram dropados
    const remainingFields = fields.filter(
      (field) => !updatedSections.some((section) => section.items?.includes(field.id))
    );

    onSectionChange(updatedSections);
    onFieldsChange(remainingFields);
  };

  const DraggableField = ({ field }: { field: FieldItem }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: field.id,
      data: { field },
    });

    return (
      <Paper
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          p: 1,
          mb: 1,
          cursor: "grab",
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        {field.name}
      </Paper>
    );
  };

  const DroppableSection = ({ section }: { section: Section }) => {
    const { setNodeRef } = useDroppable({
      id: section.id,
    });

    return (
      <Paper
        ref={setNodeRef}
        sx={{
          p: 2,
          mb: 2,
          minHeight: 120,
          backgroundColor: "#fafafa",
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">{section.name}</Typography>
        {section.items && section.items.length > 0 ? (
          section.items.map((fieldId) => {
            const field = fields.find((f) => f.id === fieldId);
            return field ? (
              <Paper key={field.id} sx={{ p: 1, mt: 1, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                {field.name}
              </Paper>
            ) : null;
          })
        ) : (
          <Typography variant="body2" sx={{ color: "#757575", mt: 1 }}>
            Arraste campos aqui
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        if (active && over) {
          handleDrop(active.id as string, over.id as string);
        }
      }}
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Campos Disponíveis (30%) */}
        <Grid xs={12} md={4}>
          <Typography variant="subtitle1" mb={1}>Campos Disponíveis</Typography>
          {fields.length > 0 ? (
            fields.map((field) => <DraggableField key={field.id} field={field} />)
          ) : (
            <Typography variant="body2" sx={{ color: "#757575", mt: 1 }}>
              Nenhum campo disponível
            </Typography>
          )}
        </Grid>

        {/* Seções (70%) */}
        <Grid xs={12} md={8}>
          <Typography variant="subtitle1" mb={1}>Seções</Typography>
          {sections.map((section) => <DroppableSection key={section.id} section={section} />)}
          <Button variant="outlined" onClick={handleAddSection} startIcon={<AddIcon />}>
            Nova Seção
          </Button>
        </Grid>
      </Grid>
    </DndContext>
  );
}
