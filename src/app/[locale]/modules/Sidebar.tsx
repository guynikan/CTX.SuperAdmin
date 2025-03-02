"use client";

import { Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountCircle, Login, TrendingUp } from "@mui/icons-material";

const modules = [
  { label: "Manutenção cadastral", icon: <AccountCircle />, path: "/modules/manutencao-cadastral" },
  { label: "Adesão", icon: <Login />, path: "/modules/adesao" },
  { label: "Rentabilidade", icon: <TrendingUp />, path: "/modules/rentabilidade" },
];

const handleAddModule = () => {
  console.log("Adicionar módulo");
};

export default function Sidebar() {
  const hasModules = modules.length > 0;

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
           <Link key={item.path} href={item.path} passHref>
      
           <Button
             variant="outlined"
             fullWidth
             startIcon={item.icon}
             sx={{
               justifyContent: "flex-start",
               p: 1.8,
               my:1, 
               borderRadius: 3,
               fontSize: "1rem",
               fontWeight: 500,
               color: pathname === item.path ? "red" : "black",
               backgroundColor: pathname === item.path ? "red" : "white",
               "&:hover": {
                 backgroundColor: pathname === item.path ? "red" : "#ebebeb",
               },
             }}
           >
             {item.label}
           </Button>
         </Link>
        ))}
      </Paper>}
    </>
  );
}
