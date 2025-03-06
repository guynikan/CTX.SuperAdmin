"use client";

import { useParams } from "next/navigation";
import { Box, Button, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Home } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { useCreateModule, useModuleById } from "@/hooks/useModules";
import { useState } from "react";
import CreateModuleModal from "../components/CreateModal";

export default function ModulePageDetail() {
  const {  dictionary } = useDictionary();
  
  const { module: id } = useParams();
  const { data: module, isLoading } = useModuleById(String(id));

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
        parentId: module?.id,
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
    <Box sx={{ textAlign: "center" }}>
      {isLoading ? (
         <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : module ? (
        <>
         {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Home fontSize="small" sx={{ color: "#757575" }} />
              <Typography variant="subtitle2" sx={{ color: "#757575" }}>Home / {dictionary?.rootName} / {module.name}</Typography>
            </Box>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ textAlign:"left" }}>{module.name}</Typography>   
          <Typography sx={{ mb: 2, textAlign:"left" }}>{module.description}</Typography>    
 
          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button onClick={()=> setIsModalOpen(true)} variant="outlined" startIcon={<AddIcon />}>{dictionary?.newSubModule}</Button>
            <Button variant="outlined" startIcon={<SettingsIcon />}>{dictionary?.newConfiguration}</Button>
          </Box>

          {/* Submodules */}
          <Typography sx={{textAlign:"left" }} variant="subtitle1" fontWeight={600}>{dictionary?.subModules}</Typography>
          <Divider sx={{ my: 1 }} />

          {/* {module.children && module.children?.map((item) => (
            <h1 key={item}>{item}</h1>
          ))} */}

          {module.children?.map(submodule => (<><h1 key={submodule.id}>{submodule.name}</h1></>))}
       
        </>
      ) : (
        <Typography variant="h5">{dictionary?.emptySingle}</Typography>
      )}

      <CreateModuleModal 
        open={isModalOpen} 
        onSubmit={addModule}
        moduleData={moduleData}
        setModuleData={setModuleData}
        loading={loading}
        onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
