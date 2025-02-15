"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSegmentTypes, useDeleteSegmentType, useUpdateSegmentType } from "@/hooks/useSegmentTypes";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nome", width: 200 },
  { field: "description", headerName: "Descrição", width: 250 },
  { field: "priority", headerName: "Prioridade", width: 150 },
  {
    field: "actions",
    headerName: "Ações",
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <DeleteButton id={params.row.id} />
        <EditButton id={params.row.id} />
      </Box>
    ),
  },
];

const DeleteButton = ({ id }: { id: string }) => {
  const deleteSegmentType = useDeleteSegmentType();
  
  return (
    <IconButton
      color="error"
      size="small"
      onClick={() => {alert('delete for:' + id)}}
      disabled={deleteSegmentType.isPending}
    >
      <Delete />
    </IconButton>
  );
};

const EditButton = ({ id }: { id: string }) => {
  const editSegmentType = useUpdateSegmentType();

  return (
    <IconButton
      color="primary"
      size="small"
      onClick={() => { alert( "edit for:" + id )}}
      disabled={editSegmentType.isPending}
    >
      <Edit />
    </IconButton>
  );
};

export default function SegmentTypesPage() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  if (isLoading)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        🔄 Carregando segment types...
      </Typography>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
        <Typography>⚠️ Erro ao carregar os segment types.</Typography>
        <Typography>Tente novamente mais tarde.</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Todas os Segmentos
        </Typography>
        <Button variant="contained" color="primary" size="small">
          Cadastrar Segmento
        </Button>
      </Box>

      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={segmentTypes || []}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 100]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
}
