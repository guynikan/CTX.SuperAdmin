"use client";

import { useState } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { ptBR, enUS } from "@mui/x-data-grid/locales";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";

import { SegmentType } from "@/types/segments";

import CreateModal from "./components/CreateModal"; 
import EditModal from "./components/EditModal";
import EditButton from "../components/EditButton";
import DeleteButton from "./components/DeleteButton";
import DeleteModal from "./components/DeleteModal";

const localeMap = {
  pt_BR: ptBR,
  en_US: enUS,
};

export default function SegmentTypesPage() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  const { locale, dictionary } = useDictionary();

  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedSegment, setSelectedSegment] = useState<SegmentType | null>(null);

  const handleEditClick = (segment: SegmentType) => {
    setSelectedSegment(segment);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (segment: SegmentType) => {
    setSelectedSegment(segment);
    setDeleteModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: dictionary?.types.table.name, width: 320 },
    { field: "description", headerName: dictionary?.types.table.description, width: 350 },
    { field: "priority", headerName: dictionary?.types.table.priority, width: 150 },
    {
      field: "actions",
      headerName: dictionary?.types.table.actions,
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <DeleteButton id={params.row.id} onDelete={() => handleDeleteClick(params.row)} />
          <EditButton id={params.row.id} onEdit={() => handleEditClick(params.row)} />
        </Box>
      ),
    },
  ];

  if (isLoading)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        {dictionary?.types.loading}
      </Typography>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
        <Typography> {dictionary?.types.errorTitle} </Typography>
        <Typography>{dictionary?.errorMessage}</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {dictionary?.types.title}
        </Typography>
        <Button onClick={() => setOpen(true)} variant="contained" color="primary" size="small">
          {dictionary?.types.registerButton}
        </Button>
      </Box>
      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        {segmentTypes?.length ? (
          <DataGrid
            localeText={localeMap[locale].components.MuiDataGrid.defaultProps.localeText}
            rows={segmentTypes}
            columns={columns}
            pageSizeOptions={[5, 10, 100]}
          />
        ) : (
          <Box>
            <Typography sx={{ fontSize: "16px", textAlign: "center" }} mb={2} mt={6}>
            {dictionary?.types.empty}
            </Typography>
          </Box>
        )}
      </Box>
      <EditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} segment={selectedSegment} />
      <DeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} segment={selectedSegment} />
      <CreateModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
