"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { MonacoJsonEditor } from '@/components/monaco/MonacoJsonEditor';
import { MonacoEditorProvider } from '@/components/monaco/MonacoEditorProvider';
import {
  useCreateAssociatedConfiguration,
  useCreateAssociation,
} from "@/hooks/useConfigurationAssociations";
import { useConfigurationTypes } from "@/hooks/useConfiguration";
import { useModules } from "@/hooks/useModules";
import { CreateAssociatedConfiguration } from "@/types/associations";

interface CreateAssociationFormProps {
  sourceConfigId: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function CreateAssociationForm({
  sourceConfigId,
  onBack,
  onSuccess,
}: CreateAssociationFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    configurationTypeId: "",
    moduleId: "",
    data: "{}",
    metadata: "{}",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'form' | 'editor'>('form');

  const { data: configurationTypes = [] } = useConfigurationTypes();
  const { data: modules = [] } = useModules();
  const createConfigMutation = useCreateAssociatedConfiguration();
  const createAssociationMutation = useCreateAssociation();

  // Get root modules (level 0)
  const rootModules = modules.filter(m => m.level === 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug é obrigatório";
    } else if (!/^[a-z0-9_]+$/.test(formData.slug)) {
      newErrors.slug = "Slug deve conter apenas letras minúsculas, números e underscores";
    } else if (formData.slug.length > 255) {
      newErrors.slug = "Slug deve ter no máximo 255 caracteres";
    }

    if (!formData.configurationTypeId) {
      newErrors.configurationTypeId = "Tipo de configuração é obrigatório";
    }

    if (!formData.moduleId) {
      newErrors.moduleId = "Módulo é obrigatório";
    }

    // Validate JSON
    try {
      JSON.parse(formData.data);
    } catch {
      newErrors.data = "JSON de dados inválido";
    }

    try {
      JSON.parse(formData.metadata);
    } catch {
      newErrors.metadata = "JSON de metadados inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create the configuration
      const configData: CreateAssociatedConfiguration = {
        title: formData.title,
        slug: formData.slug, // Obrigatório conforme API
        description: formData.description || undefined,
        configurationTypeId: formData.configurationTypeId,
        moduleId: formData.moduleId,
        baseConfigurationId: null,
        isActive: true,
        version: "1.0.0",
        metadata: JSON.parse(formData.metadata),
        data: JSON.parse(formData.data),
      };

      const newConfig = await createConfigMutation.mutateAsync(configData);
      
      if (newConfig) {
        // Create the association
        await createAssociationMutation.mutateAsync({
          sourceConfigurationId: sourceConfigId,
          targetConfigurationId: newConfig.id,
          isActive: true,
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating configuration and association:", error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const selectedConfigType = configurationTypes.find(ct => ct.id === formData.configurationTypeId);

  const getSchemaForType = () => {
    try {
      if (selectedConfigType?.dataSchema) {
        return JSON.parse(selectedConfigType.dataSchema);
      }
    } catch (error) {
      console.warn("Failed to parse data schema:", error);
    }
    return undefined;
  };

  const getMetadataSchema = () => {
    try {
      if (selectedConfigType?.metadataSchema) {
        return JSON.parse(selectedConfigType.metadataSchema);
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
          <Typography variant="subtitle1" fontWeight="bold">
            {currentStep === 'form' ? 'Nova Configuração Associada' : 'Editar Conteúdo'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentStep === 'form' 
              ? 'Preencha as informações básicas'
              : 'Configure os dados e metadados em JSON'
            }
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {currentStep === 'form' ? (
            <Button
              onClick={() => {
                if (validateForm()) {
                  setCurrentStep('editor');
                }
              }}
              variant="contained"
              size="small"
              disabled={!formData.title || !formData.slug || !formData.configurationTypeId || !formData.moduleId}
            >
              Próximo
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setCurrentStep('form')}
                variant="outlined"
                size="small"
              >
                Voltar
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                variant="contained"
                size="small"
                disabled={createConfigMutation.isPending || createAssociationMutation.isPending}
              >
                {createConfigMutation.isPending || createAssociationMutation.isPending 
                  ? "Criando..." 
                  : "Criar & Associar"
                }
              </Button>
            </>
          )}
          
          <Button
            startIcon={<CancelIcon />}
            onClick={onBack}
            variant="text"
            size="small"
            color="secondary"
          >
            Cancelar
          </Button>
        </Box>
      </Toolbar>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {currentStep === 'form' ? (
          /* Form Step */
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Nome descritivo da configuração"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    multiline
                    rows={2}
                    placeholder="Descrição detalhada (opcional)"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    error={!!errors.slug}
                    helperText={errors.slug || "Identificador único obrigatório (apenas letras, números e _)"}
                    placeholder="identificador_unico"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.configurationTypeId}>
                    <InputLabel>Tipo de Configuração</InputLabel>
                    <Select
                      value={formData.configurationTypeId}
                      onChange={(e) => handleFieldChange('configurationTypeId', e.target.value)}
                      label="Tipo de Configuração"
                    >
                      {configurationTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          <Box>
                            <Typography>{type.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.configurationTypeId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.configurationTypeId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.moduleId}>
                    <InputLabel>Módulo</InputLabel>
                    <Select
                      value={formData.moduleId}
                      onChange={(e) => handleFieldChange('moduleId', e.target.value)}
                      label="Módulo"
                    >
                      {rootModules.map((module) => (
                        <MenuItem key={module.id} value={module.id}>
                          <Box>
                            <Typography>{module.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {module.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.moduleId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.moduleId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          /* Editor Step */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
            {/* Data Editor */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Dados da Configuração
                {errors.data && (
                  <Typography component="span" variant="caption" color="error" sx={{ ml: 1 }}>
                    - {errors.data}
                  </Typography>
                )}
              </Typography>
              <MonacoEditorProvider
                config={{
                  schema: getSchemaForType(),
                  autocomplete: {
                    configId: sourceConfigId,
                    enabled: true,
                    cacheTypes: true
                  },
                  theme: 'vs-dark',
                  readOnly: false,
                  wordWrap: true,
                  minimap: false
                }}
              >
                <MonacoJsonEditor
                  value={formData.data}
                  onChange={(value) => handleFieldChange('data', value || '{}')}
                  height="40vh"
                  placeholder="Enter configuration data in JSON format..."
                />
              </MonacoEditorProvider>
            </Box>

            <Divider />

            {/* Metadata Editor */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Metadados
                {errors.metadata && (
                  <Typography component="span" variant="caption" color="error" sx={{ ml: 1 }}>
                    - {errors.metadata}
                  </Typography>
                )}
              </Typography>
              <MonacoEditorProvider
                config={{
                  schema: getMetadataSchema(),
                  autocomplete: {
                    configId: sourceConfigId,
                    enabled: true,
                    cacheTypes: true
                  },
                  theme: 'vs-dark',
                  readOnly: false,
                  wordWrap: true,
                  minimap: false
                }}
              >
                <MonacoJsonEditor
                  value={formData.metadata}
                  onChange={(value) => handleFieldChange('metadata', value || '{}')}
                  height="30vh"
                  placeholder="Enter metadata in JSON format..."
                />
              </MonacoEditorProvider>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
