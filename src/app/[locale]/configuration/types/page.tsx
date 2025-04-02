"use client";

import { useState } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { ptBR, enUS } from "@mui/x-data-grid/locales";
import { useDictionary } from "@/i18n/DictionaryProvider";

import { useConfigurationTypes, useDeleteConfigurationType } from "@/hooks/useConfigurationTypes";

import EditButton from "@/app/components/EditButton";

import CreateModal from "./components/CreateModal"; 
import EditModal from "./components/EditModal";
import { ConfigurationType } from "@/types/configuration";
import GenericDeleteModal from "@/app/components/DeleteModal";
import DeleteButton from "@/app/components/DeleteButton";

const localeMap = {
  pt_BR: ptBR,
  en_US: enUS,
};

export default function SegmentTypesPage() {
  const { data: configurationTypes, isLoading, error } = useConfigurationTypes();

  const { locale, dictionary } = useDictionary();

  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedConfiguration, setSelectedConfiguration] = useState<ConfigurationType | null>(null);

  const deleteConfigurationType = useDeleteConfigurationType();

  const handleEditClick = (configuration: ConfigurationType) => {
    setSelectedConfiguration(configuration);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (configuration: ConfigurationType) => {
    setSelectedConfiguration(configuration);
    setDeleteModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: dictionary?.configuration?.table?.name, width: 320 },
    { field: "description", headerName: dictionary?.configuration?.table?.description, width: 350 },
    {
      field: "actions",
      headerName: dictionary?.configuration?.table?.actions,
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <EditButton id={params.row.id} onEdit={() => handleEditClick(params.row)} /> 
          <DeleteButton onDelete={() => handleDeleteClick(params.row)} />
    
        </Box>
      ),
    },
  ];

  if (isLoading)
    return (
      <Typography sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
        {dictionary?.common?.loading}
      </Typography>
    );

  if (error)
    return (
      <Box sx={{ padding: 2, textAlign: "center", color: "red" }}>
        <Typography> {dictionary?.common?.errorTitle} </Typography>
        <Typography>{dictionary?.common?.errorMessage}</Typography>
      </Box>
    );

  return (

    <Box sx={{ width: "100%", maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {dictionary?.configuration?.title}
        </Typography>
        <Button onClick={() => setOpen(true)} variant="outlined" color="primary" size="small">
          {dictionary?.common?.registerButton}
        </Button>
      </Box>
      <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
        {configurationTypes?.length ? (
          <DataGrid
            localeText={localeMap[locale].components.MuiDataGrid.defaultProps.localeText}
            rows={configurationTypes}
            columns={columns}
            pageSizeOptions={[5, 10, 100]}
          />
        ) : (
          <Box>
            <Typography sx={{ fontSize: "16px", textAlign: "center" }} mb={2} mt={6}>
            {dictionary?.common?.empty}
            </Typography>
          </Box>
        )}
      </Box>

      <CreateModal open={open} onClose={() => setOpen(false)} />
      <EditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} configuration={selectedConfiguration!} />
      <GenericDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        entity={selectedConfiguration!}
        entityName="Tipo de Configuração"
        getEntityDisplayName={(s) => s?.name}
        onDelete={(id) => deleteConfigurationType.mutateAsync(id)}
      />

    </Box>
  );
}
