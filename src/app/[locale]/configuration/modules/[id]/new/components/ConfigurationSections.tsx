"use client";

import { Paper, Typography, Button, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import Grid from "@mui/material/Grid2";

import { Item, Section } from "@/types/configuration";
import { useEffect, useState, useCallback } from "react";


type ConfigurationSectionsProps =  {
  sections: Partial<Section>[];
  fields: Item[];
  onFieldsChange: (updatedFields: Item[]) => void;
  onSectionChange: (updatedSections: Partial<Section>[]) => void;
}

export default function ConfigurationSections({ fields, sections, onFieldsChange, onSectionChange}: ConfigurationSectionsProps) {

  const [assignedFields, setAssignedFields] = useState<Set<string>>(new Set());
  const [localSections, setLocalSections] = useState<Partial<Section>[]>([]);
  const [activeDragField, setActiveDragField] = useState<Item | null>(null);

  useEffect(() => {
    setLocalSections(sections.map(section => ({ ...section })));
  }, [sections]);

  const handleAddSection = () => {
    const newSection: Partial<Section> = {
      id: crypto.randomUUID(),
      name: `Seção ${localSections.length + 1}`,
      items: [],
    };
    const updatedSections = [...localSections, newSection];
    setLocalSections(updatedSections);
    onSectionChange(updatedSections);
  };

  const handleRenameSection = (id: string, newName: string) => {
    const updated = localSections.map(section =>
      section.id === id ? { ...section, name: newName } : section
    );
    setLocalSections(updated);
    onSectionChange(updated);
  };

  const handleRemoveSection = (id: string) => {
    const updated = localSections.filter(section => section.id !== id);
    setLocalSections(updated);
    onSectionChange(updated);
  };
  

  const handleDrop = (fieldId: string, sectionId: string) => {
    if (assignedFields.has(fieldId)) return; 

    setAssignedFields((prev) => new Set([...prev, fieldId]));

    const updatedSections = localSections.map((section) => {
      if (section.id !== sectionId) return section; 

      const updatedItems = new Set([...(section.items || []), fieldId]);
      return { ...section, items: Array.from(updatedItems) };
    });

    setLocalSections(updatedSections);
    onSectionChange(updatedSections);
  };

  const DraggableField = ({ field, disabled = false }: { field: Item; disabled?: boolean }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: field.id,
      data: { field },
      disabled,
    });
  
    return (
      <Paper
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onMouseDown={() => !disabled && setActiveDragField(field)} // 👈 isso aqui
        sx={{
          p: 1,
          mb: 1,
          cursor: disabled ? "not-allowed" : "grab",
          backgroundColor: disabled ? "#eee" : "#f5f5f5",
          borderRadius: 1,
          boxShadow: 1,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {field.name}
      </Paper>
    );
  };
  

  const DroppableSection = ({
    section,
    onNameChange,
    onRemove
  }: {
    section: Section;
    onNameChange: (id: string, name: string) => void;
    onRemove: (id: string) => void;

  }) => {
    const { setNodeRef } = useDroppable({ id: section.id });
    const [name, setName] = useState(section.name || "");
  
    useEffect(() => {
      setName(section.name || "");
    }, [section.name]);
  
    const handleBlur = () => {
      if (name !== section.name) {
        onNameChange(section.id, name);
      }
    };
  
    return (
      <Paper
        ref={setNodeRef}
        sx={{
          position:'relative',
          bgcolor: "white",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          mb: 2,
        }}
      >
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          variant="standard"
          fullWidth
        />
        <Button
          size="small"
          color="error"
          sx={{ fontSize:'11px', m:0, position: 'absolute', top:0, right:0, }}
          onClick={() => onRemove(section.id)}
        >
          remover
        </Button>
  
        {section.items && section.items.length > 0 ? (
          section.items.map((fieldId) => {
            const field = fields.find((f) => f.id === fieldId);
            return field ? (
              <Box
                key={field.id}
                sx={{
                  p: 1,
                  my: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                }}
              >
                {field.name}
              </Box>
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
  

  const usedFieldIds = new Set(localSections.flatMap(s => s.items.map(i => i.id)));

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        setActiveDragField(null);
        if (active && over) {
          handleDrop(active.id as string, over.id as string);
        }
      }}
    >
     
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <DragOverlay>
          {activeDragField ? (
            <Paper
              sx={{
                p: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                boxShadow: 4,
              }}
            >
              {activeDragField.name}
            </Paper>
          ) : null}
        </DragOverlay>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" mb={1}>Campos Disponíveis</Typography>
          {fields.length > 0 ? (
            fields.map((field) => (
              <DraggableField
                key={field.id}
                field={field}
                disabled={usedFieldIds.has(field.id)}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#757575", mt: 1 }}>
              Nenhum campo disponível
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="subtitle1" mb={1}>Seções</Typography>
          {localSections.map((section) => (
            <DroppableSection
              key={section.id}
              section={section as Section}
              onNameChange={handleRenameSection}
              onRemove={handleRemoveSection}
            />
          ))}
          <Button variant="outlined" onClick={handleAddSection} startIcon={<AddIcon />}>
            Nova Seção
          </Button>
        </Grid>
      </Grid>
    </DndContext>
  );
}
