"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useCallback } from "react";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { useCreateModule } from "@/hooks/useModules";

import Sidebar from "../components/Sidebar";
import CreateModuleModal from "../../modules/components/CreateModal";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const createModuleMutation = useCreateModule();

  const [moduleData, setModuleData] = useState({ name: "", description: "" });

  const addModule = useCallback(async (moduleData: { name: string; description: string }) => {
    setLoading(true);
    try {
      await createModuleMutation.mutateAsync(moduleData);
      setIsModalOpen(false);
      setModuleData({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  }, [createModuleMutation]);

  return (
    <DictionaryProvider namespaces={["common", "modules"]}>
      <Box sx={styles.container}>
        <Grid container sx={styles.gridContainer}>
          
          <Grid size={{xs:12, md:4}} sx={styles.sidebar}>
            <Sidebar handleAddModule={() => setIsModalOpen(true)} />
          </Grid>

      
          <Grid size={{xs:12, md:8}} sx={styles.mainContent}>
            {children}
          </Grid>
        </Grid>

        <CreateModuleModal 
          open={isModalOpen}
          onSubmit={addModule}
          moduleData={moduleData}
          setModuleData={setModuleData}
          loading={loading}
          onClose={() => setIsModalOpen(false)}
        />
      </Box>
    </DictionaryProvider>
  );
}

const styles = {
  container: {
    maxWidth: "90%",
    mx: "auto",
  },
  gridContainer: {
    marginTop: "40px",
    height: "100vh",
  },
  sidebar: {
    p: 2,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    px: 3,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto", 
  },
};
