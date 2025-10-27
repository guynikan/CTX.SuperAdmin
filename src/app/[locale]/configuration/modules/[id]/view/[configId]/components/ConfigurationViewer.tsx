"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Chip,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { MonacoJsonEditor } from '@/components/monaco/MonacoJsonEditor';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';

import { Configuration } from "@/types/configuration";

interface ConfigurationViewerProps {
  configuration: Configuration;
  onSave?: (updatedData: { 
    data: any; 
    metadata: any; 
    title?: string;
    description?: string;
    slug?: string;
    expression?: string;
  }) => void;
}

export interface ConfigurationViewerRef {
  save: () => void;
}

enum ViewerTabs {
  DATA = 0,
  METADATA = 1,
  SCHEMAS = 2,
  INFO = 3,
  PREVIEW = 4,
}

const ConfigurationViewer = forwardRef<ConfigurationViewerRef, ConfigurationViewerProps>(({ 
  configuration, 
  onSave, 
}, ref) => {
  const [activeTab, setActiveTab] = useState(ViewerTabs.DATA);
  const [editedData, setEditedData] = useState(configuration.data);
  const [editedMetadata, setEditedMetadata] = useState(configuration.metadata);
  const [editedTitle, setEditedTitle] = useState(configuration.title);
  const [editedDescription, setEditedDescription] = useState(configuration.description || "");
  const [editedSlug, setEditedSlug] = useState(configuration.slug || "");
  const [editedExpression, setEditedExpression] = useState(configuration.expression || "");

  const handleSave = () => {
    onSave?.({ 
      data: editedData, 
      metadata: editedMetadata,
      title: editedTitle,
      description: editedDescription,
      slug: editedSlug,
      expression: editedExpression,
    });
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  const handleExportJson = () => {
    const dataToExport = {
      configuration: {
        id: configuration.id,
        title: configuration.title,
        description: configuration.description,
        version: configuration.version,
        slug: configuration.slug,
        data: configuration.data,
        metadata: configuration.metadata,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${configuration.slug || configuration.id}_configuration.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const safeSchemaParser = (schemaString: string) => {
    try {
      return JSON.parse(schemaString);
    } catch {
      return { error: "Invalid Schema", raw: schemaString };
    }
  };

  return (
    <Box>
      {/* Header da configuração */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Título da configuração"
              sx={{ minWidth: 300 }}
            />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={configuration.isActive ? "Ativo" : "Inativo"}
                  size="small"
                  color={configuration.isActive ? "success" : "error"}
                />
                {configuration.hasRule && (
                  <Chip
                    label="Com Regras"
                    size="small"
                    color="info"
                    icon={<InfoIcon />}
                  />
                )}
              </Box>
            </Box>

            <TextField
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Descrição da configuração"
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />

            {/* Slug e Expression */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Slug"
                value={editedSlug}
                onChange={(e) => setEditedSlug(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="exemplo_slug"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Expression"
                value={editedExpression}
                onChange={(e) => setEditedExpression(e.target.value)}
                variant="outlined"
                size="small"
                multiline
                rows={2}
                placeholder="Ex: $segment.locale == 'en_us'"
                sx={{ flex: 2 }}
              />
            </Box>

            <Typography variant="caption" color="text.secondary">
              Tipo: {configuration.configurationType.name} • 
              Módulo: {configuration.module.name} •
              Atualizado: {new Date(configuration.updatedAt).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportJson}
            sx={{ ml: 2 }}
          >
            Exportar JSON
          </Button>
        </Box>
      </Paper>

      {/* Tabs de conteúdo */}
      <Paper sx={{ p: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Dados (JSON)" />
          <Tab label="Metadados" />
          <Tab label="Schemas" />
          <Tab label="Preview" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Dados da Configuração */}
          {activeTab === ViewerTabs.DATA && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Dados da Configuração
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edite os dados da configuração. Você pode adicionar, remover e modificar valores.
                  </Typography>
                </Box>
              </Box>
              
              <MonacoJsonEditor
                value={JSON.stringify(editedData || {}, null, 2)}
                onChange={(value) => {
                  if (value) {
                    try {
                      const parsedData = JSON.parse(value);
                      setEditedData(parsedData);
                    } catch (error) {
                      // Handle JSON parsing errors gracefully
                      console.warn('Invalid JSON entered:', error);
                    }
                  }
                }}
                schema={configuration.configurationType?.dataSchema ? 
                  safeSchemaParser(configuration.configurationType.dataSchema) : undefined}
                height={400}
                readOnly={false}
                placeholder="Enter configuration data in JSON format..."
                configId={configuration.id}
              />
            </Box>
          )}

          {/* Tab 2: Metadados */}
          {activeTab === ViewerTabs.METADATA && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Metadados da Configuração
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edite os metadados da configuração. Adicione informações contextuais e organizacionais.
                  </Typography>
                </Box>
              </Box>
              
              <MonacoJsonEditor
                value={JSON.stringify(editedMetadata || {}, null, 2)}
                onChange={(value) => {
                  if (value) {
                    try {
                      const parsedData = JSON.parse(value);
                      setEditedMetadata(parsedData);
                    } catch (error) {
                      // Handle JSON parsing errors gracefully
                      console.warn('Invalid JSON entered:', error);
                    }
                  }
                }}
                schema={configuration.configurationType?.metadataSchema ? 
                  safeSchemaParser(configuration.configurationType.metadataSchema) : undefined}
                height={400}
                readOnly={false}
                placeholder="Enter metadata in JSON format..."
                configId={configuration.id}
              />
            </Box>
          )}

          {/* Tab 3: Schemas */}
          {activeTab === ViewerTabs.SCHEMAS && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Schemas de Validação
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Schemas JSON utilizados para validação dos dados
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Schema
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Schema para validação dos dados principais
                      </Typography>
                      <MonacoJsonEditor
                        value={JSON.stringify(safeSchemaParser(configuration.configurationType.dataSchema), null, 2)}
                        onChange={() => {}} // Schema is read-only
                        height={300}
                        readOnly={true}
                        placeholder="Data schema definition..."
                        configId={configuration.id}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Metadata Schema
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Schema para validação dos metadados
                      </Typography>
                      <MonacoJsonEditor
                        value={JSON.stringify(safeSchemaParser(configuration.configurationType.metadataSchema), null, 2)}
                        onChange={() => {}} // Schema is read-only
                        height={300}
                        readOnly={true}
                        placeholder="Metadata schema definition..."
                        configId={configuration.id}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
});

export default ConfigurationViewer;
