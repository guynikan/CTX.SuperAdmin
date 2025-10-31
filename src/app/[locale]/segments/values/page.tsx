"use client";


import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";

import { useDeleteSegmentValue, useSegmentValues } from "@/hooks/segments/useSegmentValues";

import CreateModal from "./components/CreateModal";
import { useState } from "react";

import { SegmentValue } from "@/types/segments";
import EditModal from "./components/EditModal";
import DeleteButton from "@/app/components/DeleteButton";
import EditButton from "@/app/components/EditButton";
import DeleteModal from "@/app/components/DeleteModal";

export default function SegmentValuesPage() {

  const { data: segmentValues, isLoading, error } = useSegmentValues();
  const deleteSegmentValue =  useDeleteSegmentValue();

  const { dictionary: translations } = useDictionary();
  const dictionary = translations.segments;

  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [selectedSegment, setSelectedSegment] = useState<SegmentValue>();

  const handleDeleteClick = (segment: SegmentValue) => {
    setSelectedSegment(segment);
    setDeleteModalOpen(true);
  };
  const handleEditClick = (segment: SegmentValue) => {
    setSelectedSegment(segment);
    setEditModalOpen(true);
  };
  
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
      field: "parentSegmentValueId",
      headerName: "Parent Segment",
      width: 200,
      renderCell: (params) => {
        const parentId = params.row.parentSegmentValueId;
        const parent = params.row.parent;
        if (!parentId) {
          return <Typography variant="body2" color="text.secondary">—</Typography>;
        }
        return (
          <Typography variant="body2" title={parentId}>
            {parent?.displayName || parent?.value || parentId.substring(0, 8) + '...'}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName:  "Ações",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <EditButton onEdit={() => handleEditClick(params.row)} />
          <DeleteButton onDelete={() => handleDeleteClick(params.row)} />
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
        <Button onClick={() => setOpen(true)}  variant="outlined" color="primary" size="small">
         {dictionary?.values.registerButton}
        </Button>
      </Box>

      <Box sx={{ height: "90vh", width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={segmentValues || []}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
        />
      </Box>

      <CreateModal open={open} onClose={() => setOpen(false)} />

      <EditModal segment={selectedSegment} open={editModalOpen} onClose={() => setEditModalOpen(false)} />
        
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        entity={selectedSegment!}
        entityName="Valores de Segmentos"
        getEntityDisplayName={(s) => s?.displayName}
        onDelete={(id) => deleteSegmentValue.mutateAsync(id)}
      />
  </Box>
  );
}
