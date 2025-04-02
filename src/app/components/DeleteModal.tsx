"use client";

import { Modal, Box, Button, Typography } from "@mui/material";
import { useState } from "react";

type DeleteModalProps<T> = {
  open: boolean;
  onClose: () => void;
  entity: T;
  entityName: string; 
  getEntityDisplayName: (entity: T) => string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteModal<T extends { id: string }>({
  open,
  onClose,
  entity,
  entityName,
  getEntityDisplayName,
  onDelete,
}: DeleteModalProps<T>) {
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    if (!entity?.id) return;

    setLoading(true);
    try {
      await onDelete(entity.id);
      onClose();
    } catch (err) {
      console.error(`Erro ao deletar ${entityName.toLowerCase()}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          borderTop: "5px solid #333",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 20,
          p: 5,
          borderRadius: 1,
        }}
      >
        <Typography data-testid="remove-title" sx={{ fontSize: "16px", textAlign: "center" }} mb={2}>
          Deseja remover {entityName}: <strong>{getEntityDisplayName(entity)}</strong>?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{ marginRight: 2 }}
            variant="contained"
            color="error"
            size="small"
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? "Removendo..." : "Remover"}
          </Button>

          <Button onClick={onClose} variant="outlined" color="primary" size="small">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
