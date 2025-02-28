"use client";

import { Box, Button, Typography } from "@mui/material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { useModules } from "@/hooks/useModules";
import TreeFlow from "./components/Tree";
import { useState, useMemo } from "react";
import DataTable from "./components/DataTable";

export default function ModulesPage() {
  const { data: modules, isLoading, error } = useModules();
  const {  dictionary } = useDictionary();

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
        
        <Button
          data-testid="view-mode"
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => setViewMode(viewMode === "table" ? "tree" : "table")}
        >
          {viewMode === "table" ? "Ver como Árvore" : "Ver como Tabela"}
        </Button>
      </Box>

      <Box sx={{ height: "800px", width: "100%", overflowX: "auto" }}>
        {viewMode === "table" ? 
        ( <DataTable modules={modules} />) : (
          <TreeFlow data={treeData} />
        )}
      </Box>
    </Box>
  );
}
