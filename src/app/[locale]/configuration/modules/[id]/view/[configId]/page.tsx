"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { useConfigurationById, useUpdateConfiguration } from "@/hooks/useConfiguration";
import ConfigurationViewer, { ConfigurationViewerRef } from "./components/ConfigurationViewer";
import { toast } from "react-toastify";

export default function ConfigurationViewPage() {
  const { id: moduleId, configId } = useParams();
  const { data: configuration, isLoading, error } = useConfigurationById(String(configId));
  const updateConfigurationMutation = useUpdateConfiguration();
  const [isSaving, setIsSaving] = useState(false);
  const configurationViewerRef = useRef<ConfigurationViewerRef>(null);

  const handleSave = async (updatedData: {
    data: any;
    metadata: any;
    title?: string;
    description?: string;
    slug?: string;
    expression?: string;
  }) => {
    if (!configuration) return;
    
    setIsSaving(true);
    try {
      await updateConfigurationMutation.mutateAsync({
        configId: configuration.id,
        data: {
          configurationTypeId: configuration.configurationTypeId,
          moduleId: configuration.moduleId,
          title: updatedData.title || configuration.title,
          description: updatedData.description || configuration.description,
          slug: updatedData.slug || configuration.slug,
          expression: updatedData.expression || configuration.expression,
          data: updatedData.data,
          metadata: updatedData.metadata,
          isActive: configuration.isActive,
        }
      });
      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Erro ao salvar configuração");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Erro ao carregar configuração
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </Typography>
      </Box>
    );
  }

  if (!configuration) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Configuração não encontrada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A configuração solicitada não existe ou foi removida.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header com navegação */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            href={`/configuration/modules/${moduleId}`}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
          >
            Voltar ao Módulo
          </Button>
          
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              {configuration.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {configuration.description}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() => {
            configurationViewerRef.current?.save();
          }}
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>

      {/* Componente de visualização */}
      <ConfigurationViewer 
        ref={configurationViewerRef}
        configuration={configuration} 
        onSave={handleSave}
      />
    </Box>
  );
}
