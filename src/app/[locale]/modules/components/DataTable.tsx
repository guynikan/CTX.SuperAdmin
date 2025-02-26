"use client";

import { useDictionary } from "@/i18n/DictionaryProvider";
import { Module } from "@/types/modules";
import { Box, Typography } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { ptBR, enUS } from "@mui/x-data-grid/locales";

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

  // Construindo a hierarquia
  modules.forEach((mod) => {
    if (mod.parentId && map.has(mod.parentId)) {
      const parent = map.get(mod.parentId);
      parent.children.push(map.get(mod.id));
      map.get(mod.id).path = [...parent.path, mod.name]; // Construindo path
    } else {
      map.get(mod.id).path = [mod.name]; // Raízes começam do próprio nome
      roots.push(map.get(mod.id));
    }
  });

  return Array.from(map.values());
};

export default function DataTable({ modules }: { modules: Module[] }) {
  const { locale, dictionary } = useDictionary();

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
      renderCell: () => (
        <Box sx={{ display: "flex", gap: 1 }}>{/* Botões de ação */}</Box>
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
    </>
  );
}
