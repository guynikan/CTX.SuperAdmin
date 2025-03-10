"use client";

import { Box, Button, CircularProgress, IconButton, Paper, Tab, Tabs, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { useCreateModule, useModuleById } from "@/hooks/useModules";

import { useParams } from "next/navigation";

import Link from "next/link";
import CreateModuleModal from "../../../modules/components/CreateModal";
import { Fragment, useState } from "react";

export default function ModulePageDetail() {
  const { dictionary } = useDictionary();

  const { module: id } = useParams();
  const { data: module, isLoading } = useModuleById(String(id));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
          <Fragment key={module.id}>

       
         {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ textAlign:"left" }}>{module.name}</Typography>   
              <Typography sx={{ mb: 2, textAlign:"left" }}>{module.description}</Typography>    
            </Box>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>
          
          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Link href={`/configuration/new?moduleId=${module.id}&name=${module.name}`} passHref>
              <Button variant="outlined" startIcon={<SettingsIcon />}>
                {dictionary?.newConfiguration}
              </Button>
            </Link>
            <Button onClick={()=>setIsModalOpen(true)} variant="outlined" startIcon={<AddIcon />}>{dictionary?.newSubModule}</Button>
            
          </Box>



          {/* Submodules */}
          {!!module.children?.length && 
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs sx={{borderBottom:'1px solid #e5e5e5'}} value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>  
                {module.children?.map(submodule => (<Tab key={submodule.id}  label={submodule.name} />))}
              </Tabs>
            </Paper>
          }

          </Fragment>
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
