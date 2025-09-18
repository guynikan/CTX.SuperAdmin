"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { MonacoJsonEditor } from '@/components/monaco/MonacoJsonEditor';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { Configuration } from "@/types/configuration";

interface ConfigurationViewerProps {
  configuration: Configuration;
  isEditMode?: boolean;
  onSave?: (updatedData: { data: any; metadata: any }) => void;
  onCancel?: () => void;
}

enum ViewerTabs {
  DATA = 0,
  METADATA = 1,
  SCHEMAS = 2,
  INFO = 3,
  PREVIEW = 4,
}

export default function ConfigurationViewer({ 
  configuration, 
  isEditMode = false, 
  onSave, 
  onCancel 
}: ConfigurationViewerProps) {
  const [activeTab, setActiveTab] = useState(ViewerTabs.DATA);
  const [editedData, setEditedData] = useState(configuration.data);
  const [editedMetadata, setEditedMetadata] = useState(configuration.metadata);

  // Ensure editedData is properly initialized when isEditMode changes
  useEffect(() => {
    if (isEditMode) {
      setEditedData(configuration.data || {});
      setEditedMetadata(configuration.metadata || {});
    }
  }, [isEditMode, configuration.data, configuration.metadata]);

  const handleSave = () => {
    onSave?.({ data: editedData, metadata: editedMetadata });
  };

  const handleCancel = () => {
    setEditedData(configuration.data);
    setEditedMetadata(configuration.metadata);
    onCancel?.();
  };

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
              <Typography variant="h6" component="h2">
                {configuration.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={`v${configuration.version}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {configuration.slug && (
                  <Chip
                    label={configuration.slug}
                    size="small"
                    variant="outlined"
                  />
                )}
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

            <Typography variant="body1" color="text.secondary" gutterBottom>
              {configuration.description}
            </Typography>

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
          <Tab label="Informações" />
          <Tab label="Preview" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 1: Dados da Configuração */}
          {activeTab === ViewerTabs.DATA && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Dados da Configuração {isEditMode && "(Modo Edição)"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isEditMode 
                      ? "Edite os dados da configuração. Você pode adicionar, remover e modificar valores."
                      : "Conteúdo principal da configuração em formato JSON"
                    }
                  </Typography>
                </Box>
                
                {isEditMode && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={handleSave}
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      color="secondary"
                      size="small"
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
              
              <MonacoJsonEditor
                value={JSON.stringify(isEditMode ? (editedData || {}) : (configuration.data || {}), null, 2)}
                onChange={(value) => {
                  if (isEditMode && value) {
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
                readOnly={!isEditMode}
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
                    Metadados da Configuração {isEditMode && "(Modo Edição)"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isEditMode 
                      ? "Edite os metadados da configuração. Adicione informações contextuais e organizacionais."
                      : "Informações adicionais sobre a configuração"
                    }
                  </Typography>
                </Box>

                {isEditMode && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={handleSave}
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      color="secondary"
                      size="small"
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
              
              <MonacoJsonEditor
                value={JSON.stringify(isEditMode ? (editedMetadata || {}) : (configuration.metadata || {}), null, 2)}
                onChange={(value) => {
                  if (isEditMode && value) {
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
                readOnly={!isEditMode}
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

          {/* Tab 4: Informações Gerais */}
          {activeTab === ViewerTabs.INFO && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Informações Gerais
              </Typography>
              
              <Grid container spacing={3}>
                {/* Informações da Configuração */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Detalhes da Configuração
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">ID:</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {configuration.id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Versão:</Typography>
                          <Typography variant="body2">{configuration.version}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Slug:</Typography>
                          <Typography variant="body2">{configuration.slug || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Status:</Typography>
                          <Typography variant="body2">
                            {configuration.isActive ? 'Ativo' : 'Inativo'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Tem Regras:</Typography>
                          <Typography variant="body2">
                            {configuration.hasRule ? 'Sim' : 'Não'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Criado:</Typography>
                          <Typography variant="body2">
                            {new Date(configuration.createdAt).toLocaleString('pt-BR')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Atualizado:</Typography>
                          <Typography variant="body2">
                            {new Date(configuration.updatedAt).toLocaleString('pt-BR')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informações do Módulo */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Módulo
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Nome:</Typography>
                          <Typography variant="body2">{configuration.module.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Descrição:</Typography>
                          <Typography variant="body2">{configuration.module.description}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Nível:</Typography>
                          <Typography variant="body2">{configuration.module.level}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Status:</Typography>
                          <Typography variant="body2">
                            {configuration.module.isActive ? 'Ativo' : 'Inativo'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Informações do Tipo */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Tipo de Configuração
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Nome:</Typography>
                          <Typography variant="body2">{configuration.configurationType.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Slug:</Typography>
                          <Typography variant="body2">{configuration.configurationType.slug}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Descrição:</Typography>
                          <Typography variant="body2">{configuration.configurationType.description}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="bold">Status:</Typography>
                          <Typography variant="body2">
                            {configuration.configurationType.isActive ? 'Ativo' : 'Inativo'}
                          </Typography>
                        </Box>
                      </Box>
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
}
