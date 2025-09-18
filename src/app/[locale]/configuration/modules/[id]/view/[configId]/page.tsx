"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useConfigurationById } from "@/hooks/useConfiguration";
import ConfigurationViewer from "./components/ConfigurationViewer";

export default function ConfigurationViewPage() {
  const { id: moduleId, configId } = useParams();
  const { data: configuration, isLoading, error } = useConfigurationById(String(configId));
  const [isEditMode, setIsEditMode] = useState(false);

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
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 2 }}>
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
          onClick={() => setIsEditMode(!isEditMode)}
          startIcon={isEditMode ? <VisibilityIcon /> : <EditIcon />}
          variant="contained"
          color={isEditMode ? "secondary" : "primary"}
        >
          {isEditMode ? "Modo Visualização" : "Editar Configuração"}
        </Button>
      </Box>

      {/* Componente de visualização */}
      <ConfigurationViewer 
        configuration={configuration} 
        isEditMode={isEditMode}
        onSave={(updatedData) => {
          // TODO: Implementar chamada da API para salvar
          console.log("Saving configuration:", updatedData);
          setIsEditMode(false);
        }}
        onCancel={() => setIsEditMode(false)}
      />
    </Box>
  );
}
