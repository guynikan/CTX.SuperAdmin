"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";

import { useState } from "react";
import { useCreateModule } from "@/hooks/useModules";

import Sidebar from "../components/Sidebar";
import CreateModuleModal from "../../modules/components/CreateModal";


export default function ModulesLayout({ children }: { children: React.ReactNode }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createModuleMutation = useCreateModule();
  
  const [moduleData, setModuleData] = useState({
    name: "",
    description: "",
  });

  const addModule = async (moduleData: object) => {
    setLoading(true);
    try {
      await createModuleMutation.mutateAsync({
        name: moduleData.name,
        description: moduleData.description,
      });
      setIsModalOpen(false);
      setModuleData({ name: "", description: "" }); 
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
  <DictionaryProvider namespace="modules">
    <Box sx={{ maxWidth: '90%', mx: "auto"}}>
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
      <CreateModuleModal 
        open={isModalOpen} 
        onSubmit={addModule}
        moduleData={moduleData}
        setModuleData={setModuleData}
        loading={loading}
        onClose={() => setIsModalOpen(false)} />
    </Box>
  </DictionaryProvider>); 
}
