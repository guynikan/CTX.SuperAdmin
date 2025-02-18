"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSegmentTypes, useDeleteSegmentType } from "@/hooks/segments/useSegmentTypes";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDictionary } from "@/i18n/DictionaryProvider";
import { ptBR, enUS } from "@mui/x-data-grid/locales";

import { useState } from "react";

import CreateModal from "./components/CreateModal"; 
import EditModal from "./components/EditModal";
import { SegmentType } from "@/types/segments";
import EditButton from "./components/EditButton";

const localeMap = {
  pt_BR: ptBR,
  en_US: enUS,
};

const DeleteButton = ({ id }: { id: string }) => {
  const deleteSegmentType = useDeleteSegmentType();
  return (
    <IconButton
      color="error"
      aria-label="delete"
      data-testid="delete-button"
      size="small"
      onClick={() => {alert('delete for:' + id)}}
      disabled={deleteSegmentType.isPending}
    >
      <Delete />
    </IconButton>
  );
};

export default function SegmentTypesPage() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  const { locale, dictionary } = useDictionary();

  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | null>(null);



  const handleEditClick = (segment: SegmentType) => {
    setSelectedSegment(segment);
    setEditModalOpen(true);
  };


  const columns: GridColDef[] = [
    { field: "name", headerName: dictionary?.table.name, width: 320 },
    { field: "description", headerName: dictionary?.table.description, width: 350 },
    { field: "priority", headerName: dictionary?.table.priority, width: 150 },
    {
      field: "actions",
      headerName:  dictionary?.table.actions,
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <DeleteButton id={params.row.id} />
          <EditButton id={params.row.id} onEdit={() => handleEditClick(params.row)} />
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
        <Typography> {dictionary?.errorTitle} </Typography>
        <Typography>{dictionary?.errorMessage}</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">

        {dictionary?.title} 
        </Typography>
        <Button onClick={() => setOpen(true)} variant="contained" color="primary" size="small">
        {dictionary?.registerButton} 
        </Button>
      </Box>

      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        <DataGrid
          localeText={localeMap[locale].components.MuiDataGrid.defaultProps.localeText}
          rows={segmentTypes || []}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
        />
      </Box>

      <EditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} segment={selectedSegment} />

      <CreateModal open={open} onClose={() => setOpen(false)} />

    </Box>
  );
}
