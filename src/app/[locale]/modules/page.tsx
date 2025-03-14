"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useCreateModule, useModules } from "@/hooks/useModules";

import TreeFlow from "./components/Tree";
import DataTable from "./components/DataTable";
import CreateModuleModal from "./components/CreateModal";

export default function ModulesView() {
  const { data: modules, isLoading, error } = useModules();
  const {  dictionary } = useDictionary();

  const [viewMode, setViewMode] = useState<"table" | "tree">("tree");

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moduleData, setModuleData] = useState(Object);

  const createModuleMutation = useCreateModule();
  
  const handleAddModule = async (moduleData: object) => {
    setLoading(true);
    try {
      await createModuleMutation.mutateAsync({
        name: moduleData.name,
        description: moduleData.description,
      });
      setIsModalCreateOpen(false);
      setModuleData({ name: "", description: "" }); 
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };


  if (isLoading)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        {dictionary?.loading}
      </Typography>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
        <Typography>{dictionary?.errorTitle}</Typography>
        <Typography>{dictionary?.errorMessage}</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "90%", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">{dictionary?.title}</Typography>
        <Box>
          <Button
            data-testid="view-mode"
            variant="outlined"
            color="info"
            size="small"
            onClick={() => setViewMode(viewMode === "table" ? "tree" : "table")}
          >
            {viewMode === "table" ? "Ver como Árvore" : "Ver como Tabela"}
          </Button>
          <Button
            sx={{ml:2}}
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setIsModalCreateOpen(true)}
          >
            {dictionary?.registerButton}
          </Button>
        </Box>
       
      </Box>

      <Box sx={{ height: "800px", width: "100%", overflowX: "auto" }}>
        {viewMode === "table" ? 
        ( <DataTable modules={modules} />) : (
          <TreeFlow data={modules} />
        )}
      </Box>

      <CreateModuleModal
        open={isModalCreateOpen}
        onSubmit={handleAddModule}
        moduleData={moduleData}
        setModuleData={(module: object) => setModuleData(module)}
        loading={loading}
        onClose={() => setIsModalCreateOpen(false)} 
      />  
      
    </Box>
  );
}
