"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Toolbar,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  RestoreFromTrash as RestoreIcon,
} from "@mui/icons-material";
import { MonacoJsonEditor } from '@/components/monaco/MonacoJsonEditor';
import { MonacoEditorProvider } from '@/components/monaco/MonacoEditorProvider';
import {
  useAssociatedConfiguration,
  useUpdateAssociatedConfiguration,
} from "@/hooks/useConfigurationAssociations";
import { AssociatedConfiguration, UpdateAssociatedConfiguration } from "@/types/associations";
import CreateAssociationForm from "./CreateAssociationForm";

interface AssociatedConfigurationEditorProps {
  configId: string | null; // null when creating new
  mode: 'view' | 'edit' | 'create';
  sourceConfigId: string;
  onBack?: () => void;
  onChange?: (configId?: string) => void;
}

export default function AssociatedConfigurationEditor({
  configId,
  mode: initialMode,
  sourceConfigId,
  onBack,
  onChange,
}: AssociatedConfigurationEditorProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(initialMode);
  const [editedData, setEditedData] = useState<any>(null);
  const [editedMetadata, setEditedMetadata] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    data: configuration,
    isLoading,
    error,
  } = useAssociatedConfiguration(configId || "");
  
  const updateMutation = useUpdateAssociatedConfiguration();

  // Initialize edited data when configuration loads
  useEffect(() => {
    if (configuration && mode === 'edit') {
      setEditedData(configuration.data || {});
      setEditedMetadata(configuration.metadata || {});
      setHasUnsavedChanges(false);
    }
  }, [configuration, mode]);

  // Auto-save functionality
  useEffect(() => {
    if (mode === 'edit' && hasUnsavedChanges && configId) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          if (!configuration) return;
          
          const updateData: UpdateAssociatedConfiguration = {
            configurationTypeId: configuration.configurationType.id,
            moduleId: configuration.module.id,
            title: configuration.title,
            slug: configuration.slug || `config_${configuration.id.slice(0, 8)}`,
            description: configuration.description,
            baseConfigurationId: configuration.baseConfigurationId,
            isActive: configuration.isActive,
            version: configuration.version,
            data: editedData,
            metadata: editedMetadata,
          };

          await updateMutation.mutateAsync({ configId, data: updateData });
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      setAutoSaveTimeout(timeout);

      return () => clearTimeout(timeout);
    }
  }, [editedData, editedMetadata, hasUnsavedChanges, configId, mode]);

  const handleDataChange = (value: string | undefined) => {
    if (!value || mode === 'view') return;

    try {
      const parsedData = JSON.parse(value);
      setEditedData(parsedData);
      setHasUnsavedChanges(true);
    } catch (error) {
      // Handle JSON parsing errors gracefully
      console.warn('Invalid JSON entered:', error);
    }
  };

  const handleMetadataChange = (value: string | undefined) => {
    if (!value || mode === 'view') return;

    try {
      const parsedMetadata = JSON.parse(value);
      setEditedMetadata(parsedMetadata);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.warn('Invalid JSON entered:', error);
    }
  };

  const handleSave = async () => {
    if (!configId || !configuration) return;

    try {
      const updateData: UpdateAssociatedConfiguration = {
        configurationTypeId: configuration.configurationType.id,
        moduleId: configuration.module.id,
        title: configuration.title,
        slug: configuration.slug || `config_${configuration.id.slice(0, 8)}`,
        description: configuration.description,
        baseConfigurationId: configuration.baseConfigurationId,
        isActive: configuration.isActive,
        version: configuration.version,
        data: editedData,
        metadata: editedMetadata,
      };

      await updateMutation.mutateAsync({ configId, data: updateData });
      setHasUnsavedChanges(false);
      onChange?.(configId);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCancel = () => {
    if (configuration) {
      setEditedData(configuration.data);
      setEditedMetadata(configuration.metadata);
      setHasUnsavedChanges(false);
      setMode('view');
    } else {
      onChange?.();
    }
  };

  const handleRestore = () => {
    if (configuration) {
      setEditedData(configuration.data);
      setEditedMetadata(configuration.metadata);
      setHasUnsavedChanges(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'view') {
      setMode('edit');
    } else {
      setMode('view');
    }
  };

  // Handle create mode
  if (mode === 'create') {
    return (
      <CreateAssociationForm
        sourceConfigId={sourceConfigId}
        onBack={onBack}
        onSuccess={() => onChange?.()}
      />
    );
  }

  // Handle loading state
  if (isLoading && configId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Erro ao carregar configuração: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Alert>
      </Box>
    );
  }

  // Handle no configuration selected
  if (!configuration && configId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Configuração não encontrada.
        </Alert>
      </Box>
    );
  }

  if (!configuration) {
    return null;
  }

  const getSchemaForType = () => {
    try {
      if (configuration.configurationType.dataSchema) {
        return JSON.parse(configuration.configurationType.dataSchema);
      }
    } catch (error) {
      console.warn("Failed to parse data schema:", error);
    }
    return undefined;
  };

  const getMetadataSchema = () => {
    try {
      if (configuration.configurationType.metadataSchema) {
        return JSON.parse(configuration.configurationType.metadataSchema);
      }
    } catch (error) {
      console.warn("Failed to parse metadata schema:", error);
    }
    return undefined;
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <Toolbar 
        variant="dense"
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider",
          gap: 2,
          minHeight: "64px !important",
        }}
      >
        {onBack && (
          <IconButton onClick={onBack} size="small">
            <BackIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {configuration.title}
            </Typography>
            <Chip
              label={configuration.configurationType.slug}
              size="small"
              variant="outlined"
            />
          </Box>
          
          {configuration.slug && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontFamily: "monospace" }}
            >
              {configuration.slug}
            </Typography>
          )}
        </Box>

        {/* Mode indicator and actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {mode === 'view' ? (
            <Button
              startIcon={<EditIcon />}
              onClick={toggleMode}
              variant="outlined"
              size="small"
            >
              Editar
            </Button>
          ) : (
            <>
              {hasUnsavedChanges && (
                <Tooltip title="Alterações não salvas (salvamento automático em 2s)">
                  <Chip 
                    label="Não salvo" 
                    size="small" 
                    color="warning" 
                    variant="outlined" 
                  />
                </Tooltip>
              )}
              
              <Tooltip title="Restaurar versão original">
                <IconButton onClick={handleRestore} size="small">
                  <RestoreIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
                variant="contained"
                size="small"
                disabled={updateMutation.isPending || !hasUnsavedChanges}
              >
                {updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
              
              <Button
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                variant="outlined"
                size="small"
                color="secondary"
              >
                Cancelar
              </Button>
              
              <Button
                startIcon={<ViewIcon />}
                onClick={toggleMode}
                variant="text"
                size="small"
              >
                Visualizar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "hidden", p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          {/* Data Editor */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Dados da Configuração
            </Typography>
            <MonacoEditorProvider
              config={{
                schema: getSchemaForType(),
                autocomplete: {
                  configId: configuration.id, // ✅ Contexto próprio da configuração associada
                  enabled: true,
                  cacheTypes: true
                },
                  theme: 'vs-dark',
                readOnly: mode === 'view',
                wordWrap: true,
                minimap: false
              }}
            >
              <MonacoJsonEditor
                value={JSON.stringify(
                  mode === 'edit' ? (editedData || {}) : (configuration.data || {}), 
                  null, 
                  2
                )}
                onChange={handleDataChange}
                height="40vh"
                placeholder="Enter configuration data in JSON format..."
              />
            </MonacoEditorProvider>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
