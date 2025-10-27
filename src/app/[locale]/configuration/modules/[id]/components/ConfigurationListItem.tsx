"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Configuration } from "@/types/configuration";

interface ConfigurationListItemProps {
  config: Configuration;
  moduleId: string;
}

export default function ConfigurationListItem({
  config,
  moduleId,
}: ConfigurationListItemProps) {
  const getConfigTypeColor = (typeSlug: string) => {
    const colors: Record<
      string,
      "default" | "primary" | "secondary" | "success" | "warning" | "error"
    > = {
      feature_flags: "primary",
      locale: "secondary",
      menu: "success",
      form: "warning",
      default: "default",
    };
    return colors[typeSlug] || colors.default;
  };

  return (
    <Card
      sx={{
        width: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Linha 1: Title + Chip Tipo + Botão Ver Detalhes */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ flex: 1, textAlign: "left" }}
          >
            {config.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={config.configurationType?.name || "Unknown"}
              size="small"
              color={getConfigTypeColor(
                config.configurationType?.slug || "default"
              )}
              variant="outlined"
            />
            <Tooltip title="Ver detalhes">
              <IconButton
                href={`/configuration/modules/${moduleId}/view/${config.id}`}
                size="small"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Linha 2: Slug pill */}
        {config.slug && (
          <Box sx={{ display: "flex"}}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontFamily: "monospace",
                backgroundColor: "action.hover",
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                display: "inline-block",
                mb: 1,
                textAlign: "left",
              }}
            >
              {config.slug}
            </Typography>
          </Box>
        )}

        {/* Linha 3: Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, textAlign: "left" }}
        >
          {config.description || "Sem descrição"}
        </Typography>

        {/* Linha 4: Expression */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "left" }}
        >
          <strong>Expression:</strong>{" "}
          {config.expression || "Nenhuma expression definida"}
        </Typography>
      </CardContent>
    </Card>
  );
}
