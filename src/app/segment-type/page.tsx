import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSegmentTypes } from "@/hooks/useSegmentTypes";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nome", width: 200 },
  { field: "email", headerName: "E-mail", width: 250 },
  { field: "phone", headerName: "Telefone", width: 200 },
];

export function UserTable() {
  const { data: segmentTypes, isLoading, error } = useSegmentTypes();

  if (isLoading) return <p>🔄 Carregando...</p>;

  if (error)
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>⚠️ Erro ao carregar usuários.</p>
        <p>Tente novamente mais tarde.</p>
      </div>
    );

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={segmentTypes || []}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}
