"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAssociatedConfigurationsManager } from "@/hooks/useConfigurationAssociations";
import AssociatedConfigurationsList from "./AssociatedConfigurationsList";
import AssociatedConfigurationEditor from "./AssociatedConfigurationEditor";
import { AssociatedConfiguration } from "@/types/associations";

interface AssociatedConfigurationsModalProps {
  configId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfigurationChange?: (configId: string) => void;
}

type EditorMode = 'view' | 'edit' | 'create';

export default function AssociatedConfigurationsModal({
  configId,
  isOpen,
  onClose,
  onConfigurationChange,
}: AssociatedConfigurationsModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('view');
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  const {
    associations,
    isLoading,
    error,
  } = useAssociatedConfigurationsManager(configId);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedConfigId(null);
      setEditorMode('view');
      setMobileView('list');
    }
  }, [isOpen]);

  const handleConfigurationSelect = (config: AssociatedConfiguration, mode: EditorMode = 'view') => {
    setSelectedConfigId(config.id);
    setEditorMode(mode);
    if (isMobile) {
      setMobileView('editor');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedConfigId(null);
    setEditorMode('view');
  };

  const handleCreateNew = () => {
    setSelectedConfigId(null);
    setEditorMode('create');
    if (isMobile) {
      setMobileView('editor');
    }
  };

  const handleEditorChange = (updatedConfigId?: string) => {
    if (updatedConfigId && onConfigurationChange) {
      onConfigurationChange(updatedConfigId);
    }
    
    // If creating new, switch back to list view
    if (editorMode === 'create') {
      if (isMobile) {
        setMobileView('list');
      }
      setSelectedConfigId(null);
      setEditorMode('view');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={isMobile ? false : "lg"}
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          height: isMobile ? "100vh" : "80vh",
          maxHeight: isMobile ? "100vh" : "800px",
          width: isMobile ? "100vw" : "1200px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
        }}
      >
        <SettingsIcon color="primary" />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div">
            Configurações Associadas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie as configurações vinculadas a esta configuração
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: "100%", overflow: "hidden" }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            Erro ao carregar configurações associadas: {error instanceof Error ? error.message : 'Erro desconhecido'}
          </Alert>
        )}

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!isLoading && !error && (
          <>
            {isMobile ? (
              // Mobile: Stack view with navigation
              <Box sx={{ height: "100%" }}>
                {mobileView === 'list' && (
                  <AssociatedConfigurationsList
                    associations={associations}
                    onConfigurationSelect={handleConfigurationSelect}
                    onCreateNew={handleCreateNew}
                  />
                )}
                
                {mobileView === 'editor' && (
                  <AssociatedConfigurationEditor
                    configId={selectedConfigId}
                    mode={editorMode}
                    sourceConfigId={configId}
                    onBack={handleBackToList}
                    onChange={handleEditorChange}
                  />
                )}
              </Box>
            ) : (
              // Desktop: Split view
              <Grid container sx={{ height: "100%" }}>
                <Grid
                  item
                  xs={4}
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    height: "100%",
                    overflow: "auto",
                  }}
                >
                  <AssociatedConfigurationsList
                    associations={associations}
                    selectedConfigId={selectedConfigId}
                    onConfigurationSelect={handleConfigurationSelect}
                    onCreateNew={handleCreateNew}
                  />
                </Grid>
                
                <Grid item xs={8} sx={{ height: "100%", overflow: "hidden" }}>
                  {selectedConfigId || editorMode === 'create' ? (
                    <AssociatedConfigurationEditor
                      configId={selectedConfigId}
                      mode={editorMode}
                      sourceConfigId={configId}
                      onChange={handleEditorChange}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "text.secondary",
                      }}
                    >
                      <SettingsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                      <Typography variant="h6" gutterBottom>
                        Selecione uma configuração
                      </Typography>
                      <Typography variant="body2" textAlign="center">
                        Escolha uma configuração da lista para visualizar ou editar,<br />
                        ou clique em "Adicionar" para criar uma nova.
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
