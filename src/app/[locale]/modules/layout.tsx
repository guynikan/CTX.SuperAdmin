"use client";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";

import Grid from "@mui/material/Grid2";
import Sidebar from "./components/Sidebar";
import { Box } from "@mui/material";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
  <DictionaryProvider namespace="modules">
    <Box sx={{ maxWidth: '1260px', mx: "auto", width: "100%" }}>
      <Grid container sx={{ marginTop:'40px', height: "100vh" }}>
        {/* Sidebar */}
        <Grid sx={{
            flex: "0 0 30%",
            p: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}>
          <Sidebar />
        </Grid>
        
        {/* Main Content */}
        <Grid sx={{
          flex: "0 0 70%",
          px: 3,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}>
          {children}
        </Grid>
      </Grid>
    </Box>
  </DictionaryProvider>); 
}
