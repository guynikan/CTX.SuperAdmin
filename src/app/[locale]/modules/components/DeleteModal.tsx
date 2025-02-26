"use client";

import { Modal, Box, Button, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  confirmDelete: (nodeId: string) => void;
  module: { id: string; name: string } | null;
  hasChildren: boolean;
};

export default function DeleteModal({ open, onClose, confirmDelete, module, hasChildren }: Props) {
  const [loading] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          borderTop: "5px solid #333",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          boxShadow: 20,
          p: 5,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ fontSize: "16px", textAlign: "center" }} mb={2}>
          {hasChildren ? (
            <span>
              Não é possível remover o módulo <strong>{module?.name}</strong>, pois ele contém submódulos.
            </span>
          ) : (
            <span>
              Deseja remover o módulo <strong>{module?.name}</strong>?
            </span>
          )}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {!hasChildren && (
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
          )}

          <Button onClick={onClose} variant="outlined" color="primary" size="small">
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
