"use client";


import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography, IconButton } from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { useSegmentValues } from "@/hooks/segments/useSegmentValues";

import { Delete, Edit } from "@mui/icons-material";
import CreateModal from "./components/CreateModal";
import { useState } from "react";


const DeleteButton = ({ id }: { id: string }) => {
  return (
    <IconButton
      color="error"
      aria-label="delete"
      data-testid="delete-button"
      size="small"
      onClick={() => {alert('delete for:' + id)}}  
    >
      <Delete />
    </IconButton>
  );
};

export default function SegmentValuesPage() {

  const { data: segmentValues, isLoading, error } = useSegmentValues();

  const { dictionary } = useDictionary();

  const [open, setOpen] = useState(false);
  
 
  const columns: GridColDef[] = [
    { field: "displayName", headerName: dictionary?.values.table.displayName, width: 200 },
    { field: "value", headerName: dictionary?.values.table.value, width: 180 },
    { field: "description", headerName: dictionary?.values.table.description, width: 300 },
    { field: "segmentType", 
      headerName: dictionary?.values.table.segmentType, 
      width: 150,    
      renderCell: (params) => {
        return <>{params.row.segmentType?.name}</>;
      },
    },
    {
      field: "actions",
      headerName:  "Ações",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <DeleteButton id={params.row.id} onDelete={() => handleDeleteClick(params.row)} />
          <EditButton id={params.row.id} />
        </Box>
      ),
    },
  ];
  
  if (isLoading)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        {dictionary?.values.loading}
        </Typography>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
         <Typography> {dictionary?.values.errorTitle} </Typography>
         <Typography>{dictionary?.errorMessage}</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
         {dictionary?.values.title}
        </Typography>
        <Button onClick={() => setOpen(true)}  variant="contained" color="primary" size="small">
         {dictionary?.values.registerButton}
        </Button>
      </Box>

      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={segmentValues || []}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
        />
      </Box>

      <CreateModal open={open} onClose={() => setOpen(false)} />
      
    </Box>
  );
}
