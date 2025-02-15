"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSegmentTypes, useDeleteSegmentType, useUpdateSegmentType } from "@/hooks/useSegmentTypes";
import { Box, Button, Typography } from "@mui/material";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nome", width: 200 },
  { field: "description", headerName: "Descrição", width: 250 },
  { field: "priority", headerName: "Prioridade", width: 200 },
  {
    field: "actions",
    headerName: "Ações",
    width: 150,
    renderCell: (params) => (
      <>
        <DeleteButton id={params.row.id} />
        <EditButton id={params.row.id} />
      </>
    ),
  },
];


const DeleteButton = ({ id }: { id: string }) => {
  const deleteSegmentType = useDeleteSegmentType();
  
  return (
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => deleteSegmentType.mutate(id)}
      disabled={deleteSegmentType.isPending}
    >
      {deleteSegmentType.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}

const EditButton = ({ id }: { id: string }) => {
  const editSegmentType = useUpdateSegmentType();

  return (
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={() => editSegmentType.mutate(id)}
      disabled={editSegmentType.isPending}
    >
      {editSegmentType.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}

export default function SegmentTypesPage() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  if (isLoading) return <Typography  sx={{ marginTop: '20px', display: "flex", justifyContent: "center"}}>🔄 Carregando segment types...</Typography>;

  if (error)
    return (
      <Box style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <Typography>⚠️ Erro ao carregar os segment types.</Typography>
        <Typography>Tente novamente mais tarde.</Typography>
      </Box>
    );

  return (
    <div style={{ height: 500, width: "100%" }}>
      <p>Lista de Segment Types</p>

      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => {}}> Criar
      </Button>
      

      <DataGrid
        rows={segmentTypes || []}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 100]}
        checkboxSelection
      />
    </div>
  );
}
