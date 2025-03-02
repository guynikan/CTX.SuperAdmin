"use client";

import { Paper, Button, Box, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useModules } from "@/hooks/useModules";

const handleAddModule = () => {
  console.log("Adicionar módulo");
};

export default function Sidebar() {

  const { data: modules, isLoading } = useModules();

  const rootModules = modules?.filter((module) => !module.parentId) || [];

  const pathname = usePathname();

  return (
    <>
      <Button sx={{
          overflow: "hidden",
         p: 2,
          marginBottom:'10px',
        }} 
        variant="outlined" 
        fullWidth 
        onClick={handleAddModule}
        startIcon={<AddIcon />}>
          Adicionar módulo 
       </Button>

       <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        p: 1.5,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : rootModules.length > 0 ? (
        rootModules.map((item) => (
          <Link key={item.id} href={`/modules/${item.id}`} passHref>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                p: 1.8,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 500,
                color: pathname === `/modules/${item.id}` ? "white" : "black",
                backgroundColor: pathname === `/modules/${item.id}` ? "black" : "#white",
                "&:hover": {
                  backgroundColor: pathname === `/modules/${item.id}` ? "black" : "#E0E0E0",
                },
              }}
            >
              {item.name}
            </Button>
          </Link>
        ))
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography sx={{ fontSize: "0.9rem", color: "#666", mb: 1 }}>
            Nenhum módulo cadastrado
          </Typography>
        
        </Box>
      )}
    </Paper>
    </>
  );
}
