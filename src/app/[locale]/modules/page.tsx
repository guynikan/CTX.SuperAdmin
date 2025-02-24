"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { ptBR, enUS } from "@mui/x-data-grid/locales";
import { useModules } from "@/hooks/useModules";
import TreeFlow from "./Tree";
import { useState, useMemo } from "react";

const localeMap = {
  pt_BR: ptBR,
  en_US: enUS,
};

export default function ModulesPage() {
  const { data: modules, isLoading, error } = useModules();
  const { locale, dictionary } = useDictionary();

  const [viewMode, setViewMode] = useState<"table" | "tree">("tree");

  const treeData = useMemo(() => {
    const convertToTree = (items) => {
      const map = new Map();
      const tree = [];

      items.forEach((item) => {
        map.set(item.id, { ...item, children: [] });
      });

      items.forEach((item) => {
        if (item.parentId) {
          map.get(item.parentId)?.children.push(map.get(item.id));
        } else {
          tree.push(map.get(item.id));
        }
      });

      return tree;
    };

    return convertToTree(modules || []);
  }, [modules]);

  const columns: GridColDef[] = [
    { field: "name", headerName: dictionary?.table.name, width: 320 },
    { field: "description", headerName: dictionary?.table.description, width: 250 },
    { field: "level", headerName: dictionary?.table.level, width: 150 },
    { field: "parent", headerName: dictionary?.table.parent, width: 150 },
    {
      field: "actions",
      headerName: dictionary?.table.actions,
      width: 120,
      renderCell: () => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Botões de ação aqui */}
        </Box>
      ),
    },
  ];

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
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">{dictionary?.title}</Typography>
        
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => setViewMode(viewMode === "table" ? "tree" : "table")}
        >
          {viewMode === "table" ? "Ver como Árvore" : "Ver como Tabela"}
        </Button>
      </Box>

      <Box sx={{ height: "800px", width: "100%", overflowX: "auto" }}>
        {viewMode === "table" ? (
          modules?.length ? (
            <DataGrid
              localeText={localeMap[locale].components.MuiDataGrid.defaultProps.localeText}
              rows={modules}
              columns={columns}
              pageSizeOptions={[5, 10, 100]}
            />
          ) : (
            <Typography sx={{ fontSize: "16px", textAlign: "center" }} mb={2} mt={6}>
              {dictionary?.empty}
            </Typography>
          )
        ) : (
          <TreeFlow data={treeData} />
        )}
      </Box>
    </Box>
  );
}
