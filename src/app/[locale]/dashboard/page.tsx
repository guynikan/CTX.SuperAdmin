"use client";

import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ 
      width: '100%', 
      mx: "auto", 
      textAlign:'center', 
      display:'flex',
      alignContent:'center' }}>
     <Typography sx={{margin:'100px auto'}} variant="h6" > Escolha ou crie um módulo para começar</Typography>
    </Box>
  );
}