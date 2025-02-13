"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSegmentTypes, useDeleteSegmentType } from "@/hooks/useSegmentTypes";
import { Button } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nome", width: 200 },
  { field: "description", headerName: "Descrição", width: 250 },
  { field: "priority", headerName: "Prioridade", width: 200 },
  {
    field: "actions",
    headerName: "Ações",
    width: 150,
    renderCell: (params) => (
      <DeleteButton id={params.row.id} />
    ),
  },
];

function DeleteButton({ id }: { id: string }) {
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

export default function SegmentTypesPage() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  if (isLoading) return <p>🔄 Carregando segment types...</p>;

  if (error)
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>⚠️ Erro ao carregar os segment types.</p>
        <p>Tente novamente mais tarde.</p>
      </div>
    );

  return (
    <div style={{ height: 500, width: "100%" }}>
      <p>Lista de Segment Types</p>

      <DataGrid
        rows={segmentTypes || []}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 100]}
        checkboxSelection
      />
    </div>
  );
}
