"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { SegmentType, SegmentValue } from "@/types/segments";
import { useState } from "react";
import DeleteModal from "../components/DeleteModal";
import DeleteButton from "../components/DeleteButton";

const segmentValues = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    createdAt: "2025-02-17T08:10:34.352Z",
    updatedAt: "2025-02-17T08:10:34.352Z",
    segmentTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    value: "Valor 1",
    displayName: "Exibição 1",
    description: "Descrição do segmento 1",
    isActive: true,
    segmentType: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
      createdAt: "2025-02-17T08:10:34.352Z",
      updatedAt: "2025-02-17T08:10:34.352Z",
      name: "Segmento 1",
      description: "Descrição do tipo de segmento 1",
      priority: 1,
      isActive: true,
      segmentValues: [
        "Valor 1"
      ]
    }
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
    createdAt: "2025-02-17T08:15:34.352Z",
    updatedAt: "2025-02-17T08:15:34.352Z",
    segmentTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
    value: "Valor 2",
    displayName: "Exibição 2",
    description: "Descrição do segmento 2",
    isActive: false,
    segmentType: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
      createdAt: "2025-02-17T08:15:34.352Z",
      updatedAt: "2025-02-17T08:15:34.352Z",
      name: "Segmento 2",
      description: "Descrição do tipo de segmento 2",
      priority: 2,
      isActive: false,
      segmentValues: [
        "segmentValue 1",
        "segmentValue ",
      ]
    }
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
    createdAt: "2025-02-17T08:20:34.352Z",
    updatedAt: "2025-02-17T08:20:34.352Z",
    segmentTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
    value: "Valor 3",
    displayName: "Exibição 3",
    description: "Descrição do segmento 3",
    isActive: true,
    segmentType: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
      createdAt: "2025-02-17T08:20:34.352Z",
      updatedAt: "2025-02-17T08:20:34.352Z",
      name: "Segmento 3",
      description: "Descrição do tipo de segmento 3",
      priority: 3,
      isActive: true,
      segmentValues: [
        "Valor 3"
      ]
    }
  }
];

const EditButton = ({ id }: { id: string }) => {
  return (
    <IconButton
      color="primary"
      size="small"
      aria-label="edit"
      data-testid="edit-button"
      onClick={() => { alert( "edit for:" + id )}}
    >
      <Edit />
    </IconButton>
  );
};

export default function SegmentValuesPage() {

  const [selectedSegment, setSelectedSegment] = useState<SegmentValue | SegmentType>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = (segment: SegmentType | SegmentValue) => {
    setSelectedSegment(segment);
    setDeleteModalOpen(true);
  };

 
  const columns: GridColDef[] = [
    { field: "displayName", headerName: "Nome de Exibição", width: 200 },
    { field: "value", headerName: "Valor", width: 180 },
    { field: "description", headerName: "Descrição", width: 300 },
    { field: "segmentType", 
      headerName: "Tipo de Segmento", 
      width: 150,    
      renderCell: (params) => {
        return <>{params.row.segmentType.name}</>;
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
  
  // Loading
  if (false)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        Carregando...
      </Typography>
    );

  // Erro
  if (false)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
        <Typography> Erro </Typography>
        <Typography> Tente novamente mais tarde</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
         Todos os Valores de Segmentos 
        </Typography>
        <Button variant="contained" color="primary" size="small">
          Cadastrar Valor de Segmento
        </Button>
      </Box>

      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={segmentValues || []}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
        />
      </Box>

      <DeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false) } segment={selectedSegment} />
      
    </Box>
  );
}
