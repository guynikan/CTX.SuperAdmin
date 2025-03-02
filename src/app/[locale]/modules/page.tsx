"use client";

import { Box, Button, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import { AccountCircle, Login, TrendingUp } from "@mui/icons-material";

import SettingsIcon from "@mui/icons-material/Settings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import Sidebar from "./Sidebar";

export default function ModulesPage() {

  const modules = [
    { label: "Manutenção cadastral", icon: <AccountCircle />, active: true },
    { label: "Adesão", icon: <Login />, active: false },
    { label: "Rentabilidade", icon: <TrendingUp />, active: false },
  ];

  const handleAddModule = () => {
    console.log("Adicionar módulo");
  };

  return (

    <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
      <Grid container sx={{ marginTop:'40px', height: "100vh" }}>
        {/* Sidebar */}
        <Grid sx={{
            flex: "0 0 30%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}>
         <Sidebar modules={modules} onAddModule={handleAddModule} />
        </Grid>
        
        {/* Main Content */}
        <Grid sx={{
          flex: "0 0 70%",
          px: 3,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}>

           {/* Header */}
           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeIcon fontSize="small" sx={{ color: "#757575" }} />
                <Typography variant="subtitle2" sx={{ color: "#757575" }}>Home / Módulos</Typography>
              </Box>
              {/* <IconButton>
                <FilterListIcon />
              </IconButton> */}
            </Box>

            {modules.length > 0 ? (
              <>
              
            
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Manutenção cadastral</Typography>
            
            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button variant="outlined" startIcon={<AddIcon />}>Novo Submódulo</Button>
              <Button variant="outlined" startIcon={<SettingsIcon />}>Nova Configuração</Button>
            </Box>
            
            {/* Submodules */}
            <Typography variant="subtitle1" fontWeight={600}>Submódulos</Typography>
            <Divider sx={{ my: 1 }} />
            
            {/* Empty State */}
            
          </>
        ) : (
          <Box sx={{ textAlign: "center" }}>
           <Box sx={{ display: "flex", justifyContent:'flex-start', flexDirection: "column", textAlign:'center', alignItems: "center", mt: 6 }}>
              <FolderOpenIcon sx={{ fontSize: 60, color: "#BDBDBD" }} />
              <Typography sx={{ color: "#757575" }}>Nenhum módulo cadastrado<br/>Crie no menu à esquerda</Typography>
          
            </Box>
           
          </Box>
        )}
         



        </Grid>
      </Grid>
    </Box>

    
  );
}
