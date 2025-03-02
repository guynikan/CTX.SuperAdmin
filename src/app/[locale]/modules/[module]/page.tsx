"use client";

import { useParams } from "next/navigation";
import { Box, Button, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Home } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { useModuleById } from "@/hooks/useModules";

export default function ModulePageDetail() {
  const { module: id } = useParams();
  const { data: module, isLoading } = useModuleById(String(id));

  return (
    <Box sx={{ textAlign: "center" }}>
      {isLoading ? (
         <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : module ? (

        <>
         {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Home fontSize="small" sx={{ color: "#757575" }} />
              <Typography variant="subtitle2" sx={{ color: "#757575" }}>Home / Módulos / {module.name}</Typography>
            </Box>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, textAlign:"left" }}>Módulo - {module.name}</Typography>
                
          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button variant="outlined" startIcon={<AddIcon />}>Novo Submódulo</Button>
            <Button variant="outlined" startIcon={<SettingsIcon />}>Nova Configuração</Button>
          </Box>

          {/* Submodules */}
          <Typography sx={{textAlign:"left" }} variant="subtitle1" fontWeight={600}>Submódulos</Typography>
          <Divider sx={{ my: 1 }} />
        </>
      ) : (
        <Typography variant="h5">Módulo não encontrado</Typography>
      )}
     
    </Box>
  );
}
