"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  alpha,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Language as LocaleIcon,
  Settings as ConfigIcon,
  Route as RouteIcon,
  Group as SegmentIcon,
} from "@mui/icons-material";
import { ConfigurationAssociation } from "@/types/associations";
import { useDeleteAssociation } from "@/hooks/useConfigurationAssociations";

interface AssociatedConfigurationCardProps {
  association: ConfigurationAssociation;
  isSelected?: boolean;
  onView: () => void;
  onEdit: () => void;
}

const getConfigTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'locale':
      return <LocaleIcon />;
    case 'segment':
      return <SegmentIcon />;
    case 'route':
      return <RouteIcon />;
    default:
      return <ConfigIcon />;
  }
};

const getConfigTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (type.toLowerCase()) {
    case 'locale':
      return 'info';
    case 'segment':
      return 'warning';
    case 'route':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function AssociatedConfigurationCard({
  association,
  isSelected = false,
  onView,
  onEdit,
}: AssociatedConfigurationCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteAssociationMutation = useDeleteAssociation();

  const { targetConfiguration } = association;

  const handleDelete = async () => {
    try {
      await deleteAssociationMutation.mutateAsync(association.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting association:", error);
    }
  };

  return (
    <>
      <Card
        sx={{
          mb: 1,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? "primary.main" : "divider",
          backgroundColor: isSelected 
            ? (theme) => alpha(theme.palette.primary.main, 0.05)
            : "background.paper",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 2,
          },
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                {getConfigTypeIcon(targetConfiguration.configurationTypeSlug)}
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold"
                  noWrap
                  sx={{ flex: 1 }}
                >
                  {targetConfiguration.title}
                </Typography>
              </Box>
              
              {targetConfiguration.slug && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontFamily: "monospace",
                    backgroundColor: "action.hover",
                    px: 0.5,
                    py: 0.25,
                    borderRadius: 0.5,
                  }}
                >
                  {targetConfiguration.slug}
                </Typography>
              )}
            </Box>

            <Chip
              label={targetConfiguration.configurationTypeSlug}
              size="small"
              color={getConfigTypeColor(targetConfiguration.configurationTypeSlug)}
              variant="outlined"
            />
          </Box>

          {/* Module info */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Módulo: {targetConfiguration.moduleName}
          </Typography>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mt: 1 }}>
            <Tooltip title="Visualizar">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                sx={{ color: "primary.main" }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                sx={{ color: "warning.main" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Remover associação">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja remover a associação com "{targetConfiguration.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita. A configuração associada não será deletada, 
            apenas desvinculada desta configuração.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteAssociationMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteAssociationMutation.isPending}
          >
            {deleteAssociationMutation.isPending ? "Removendo..." : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
