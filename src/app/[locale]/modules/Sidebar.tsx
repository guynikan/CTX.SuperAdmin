"use client";

import { Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


type SidebarProps =  {
  modules: { label: string; icon: Element; active: boolean }[];
  onAddModule: () => void;
}

export default function Sidebar({ modules, onAddModule }: SidebarProps) {
  const hasModules = modules.length > 0;

  return (
    <>
      <Button sx={{
          overflow: "hidden",
         p: 2,
          marginBottom:'10px',
        }} 
        variant="outlined" 
        fullWidth 
        onClick={onAddModule}
        startIcon={<AddIcon />}>
          Adicionar módulo
       </Button>

      {hasModules && <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          p: 2,
          backgroundColor: "white",
        }}
      >

        { modules.map((item, index) => (
          <Button
            key={index}
            fullWidth
            variant="outlined"
            startIcon={item.icon}
            sx={{
              justifyContent: "flex-start",
              mb: 1,
              p: 2,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 500,
              color: item.active ? "white" : "black",
              backgroundColor: item.active ? "black" : "#FFF",
              "&:hover": {
                backgroundColor: item.active ? "black" : "#f3f3f3",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Paper>}
    </>
  );
}
