"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  List,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { ConfigurationAssociation, AssociatedConfiguration } from "@/types/associations";
import AssociatedConfigurationCard from "./AssociatedConfigurationCard";

interface AssociatedConfigurationsListProps {
  associations: ConfigurationAssociation[];
  selectedConfigId?: string | null;
  onConfigurationSelect: (config: AssociatedConfiguration, mode: 'view' | 'edit') => void;
  onCreateNew: () => void;
}

type EditorMode = 'view' | 'edit' | 'create';

export default function AssociatedConfigurationsList({
  associations,
  selectedConfigId,
  onConfigurationSelect,
  onCreateNew,
}: AssociatedConfigurationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Extract unique configuration types for filter
  const availableTypes = Array.from(
    new Set(associations.map(a => a.targetConfiguration.configurationTypeSlug))
  );

  // Filter associations based on search and type filter
  const filteredAssociations = associations.filter(association => {
    const matchesSearch = 
      association.targetConfiguration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association.targetConfiguration.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      association.targetConfiguration.configurationTypeSlug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      association.targetConfiguration.configurationTypeSlug === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleConfigurationAction = (association: ConfigurationAssociation, mode: 'view' | 'edit') => {
    // Create a simplified configuration object for the callback
    const config: AssociatedConfiguration = {
      id: association.targetConfiguration.id,
      title: association.targetConfiguration.title,
      slug: association.targetConfiguration.slug,
      configurationTypeId: "", // Will be loaded when needed
      moduleId: "",
      baseConfigurationId: null,
      description: "",
      isActive: true,
      createdAt: "",
      updatedAt: "",
      data: {},
      metadata: {},
      version: "1.0.0",
      configurationType: {
        name: association.targetConfiguration.configurationTypeSlug,
        slug: association.targetConfiguration.configurationTypeSlug,
        description: "",
        metadataSchema: "",
        dataSchema: "",
        isActive: true,
        id: "",
        createdAt: "",
        updatedAt: "",
      },
      module: {
        parentId: null,
        parent: null,
        name: association.targetConfiguration.moduleName,
        description: "",
        level: 0,
        isActive: true,
        children: [],
        configurations: [],
        id: "",
        createdAt: "",
        updatedAt: "",
      },
    };

    onConfigurationSelect(config, mode);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header with actions */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="div">
            Configurações ({filteredAssociations.length})
          </Typography>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onCreateNew}
            sx={{ minWidth: "auto" }}
          >
            Adicionar
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar configurações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Type Filter */}
        {availableTypes.length > 1 && (
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Filtrar por tipo</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Filtrar por tipo"
              startAdornment={<FilterIcon sx={{ mr: 1, color: "text.secondary" }} />}
            >
              <MenuItem value="all">Todos os tipos</MenuItem>
              {availableTypes.map(type => (
                <MenuItem key={type} value={type}>
                  <Chip label={type} size="small" variant="outlined" />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Divider />

      {/* List */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {filteredAssociations.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              color: "text.secondary",
            }}
          >
            <Typography variant="body1" gutterBottom>
              {searchTerm || typeFilter !== "all" 
                ? "Nenhuma configuração encontrada" 
                : "Nenhuma configuração associada"
              }
            </Typography>
            <Typography variant="body2" textAlign="center">
              {searchTerm || typeFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Clique em 'Adicionar' para criar a primeira configuração associada"
              }
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredAssociations.map((association) => (
              <AssociatedConfigurationCard
                key={association.id}
                association={association}
                isSelected={selectedConfigId === association.targetConfiguration.id}
                onView={() => handleConfigurationAction(association, 'view')}
                onEdit={() => handleConfigurationAction(association, 'edit')}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
