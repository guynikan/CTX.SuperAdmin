"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Sidebar from "./components/Sidebar";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";

import CreateModal from "./components/CreateModal";
import { useState } from "react";


export default function ModulesLayout({ children }: { children: React.ReactNode }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Sidebar handleAddModule={() => setIsModalOpen(true)} />
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
      <CreateModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  </DictionaryProvider>); 
}
