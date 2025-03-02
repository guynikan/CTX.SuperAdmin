"use client";

import { useParams } from "next/navigation";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Home } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

export default function ModulePageDetail() {
  const { module } = useParams();

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home fontSize="small" sx={{ color: "#757575" }} />
          <Typography variant="subtitle2" sx={{ color: "#757575" }}>Home / Módulos / {decodeURIComponent(module as string)} </Typography>
        </Box>
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2, textAlign:"left" }}>Módulo - {decodeURIComponent(module as string)}</Typography>
            
      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="outlined" startIcon={<AddIcon />}>Novo Submódulo</Button>
        <Button variant="outlined" startIcon={<SettingsIcon />}>Nova Configuração</Button>
      </Box>

      {/* Submodules */}
      <Typography sx={{textAlign:"left" }} variant="subtitle1" fontWeight={600}>Submódulos</Typography>
      <Divider sx={{ my: 1 }} />
    </Box>
  );
}
