"use client";

import { useState } from "react";
import { ptBR, enUS } from "@mui/x-data-grid/locales";
import { Box, Typography } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { Module } from "@/types/modules";

import { useDeleteModule } from "@/hooks/useModules";

import DeleteButton from "../../segments/components/DeleteButton";
import EditButton from "../../segments/components/EditButton";
import DeleteModal from "./DeleteModal";

const localeMap = {
  pt_BR: ptBR,
  en_US: enUS,
};

const transformModulesToTree = (modules: Module[]): any[] => {
  const map = new Map<string, any>();
  const roots: any[] = [];

  modules.forEach((mod) => {
    map.set(mod.id, { ...mod, children: [], path: [] });
  });

  modules.forEach((module) => {
    if (module.parentId && map.has(module.parentId)) {
      const parent = map.get(module.parentId);
      parent.children.push(map.get(module.id));
      map.get(module.id).path = [...parent.path, module.name]; 
    } else {
      map.get(module.id).path = [module.name]; 
      roots.push(map.get(module.id));
    }
  });

  return Array.from(map.values());
};

export default function DataTable({ modules }: { modules: Module[] }) {
  const { locale, dictionary } = useDictionary();

  //const [editModalOpen, setEditModalOpen] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module| null>(null);
  const [openConfirm, setOpenConfirmDelete] = useState(false);

  const { mutateAsync: deleteModule } = useDeleteModule();


  const handleEditClick = (module: Module) => {
    setSelectedModule(module);
    setEditModalOpen(true);
  };
  
  const handleDeleteClick = (module: Module) => {
    const moduleHasChildren = !!module?.children?.length;
    setSelectedModule(module);
    setHasChildren(moduleHasChildren);
    setOpenConfirmDelete(true);
  };

  const handleDeleteModule = async () => { 
    try {
      await deleteModule(selectedModule?.id);
      
    } catch (error) {
      console.error(error);
    } finally{
      setOpenConfirmDelete(false)
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: dictionary?.table.name, width: 320 },
    { field: "description", headerName: dictionary?.table.description, width: 250 },
    { field: "level", headerName: dictionary?.table.level, width: 150 },
    { field: "parent", 
      headerName: dictionary?.table.parent, 
      width: 150,    
      renderCell: (params) => {
        return <>{params.row.parent?.name}</>;
      },
    },
    {
      field: "actions",
      headerName: dictionary?.table.actions,
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <EditButton id={params.row.id} onEdit={() => handleEditClick(params.row)} />
          <DeleteButton onDelete={() => handleDeleteClick(params.row)} />

        </Box>
      ),
    },
  ];

  const transformedRows = transformModulesToTree(modules);

  const getTreeDataPath = (row: any) => row.path; 

  return (
    <>
      {modules?.length ? (
        <DataGridPro
          treeData
          getTreeDataPath={getTreeDataPath}
          localeText={localeMap[locale].components.MuiDataGrid.defaultProps.localeText}
          rows={transformedRows}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
        />
      ) : (
        <Typography sx={{ fontSize: "16px", textAlign: "center" }} mb={2} mt={6}>
          {dictionary?.empty}
        </Typography>
      )}
      <DeleteModal
        confirmDelete={handleDeleteModule}
        open={openConfirm}
        onClose={() => setOpenConfirmDelete(false)}
        module={selectedModule}
        hasChildren={hasChildren}
      />

    </>

    
  );
}
