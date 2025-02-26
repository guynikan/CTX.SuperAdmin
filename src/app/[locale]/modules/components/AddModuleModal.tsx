"use client";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface AddModuleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  setValue: (value: string) => void;
  loading: boolean;
}

export default function AddModuleModal({ open, onClose, onSubmit, value, setValue, loading }: AddModuleModalProps){ 
  return(
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, bgcolor: "background.paper", borderTop: "5px solid #333", boxShadow: 20, p: 5, borderRadius: 1 }}>
        <Typography variant="h6">Adicionar Novo Módulo</Typography>
        <TextField label="Nome" fullWidth margin="dense" value={value} onChange={(e) => setValue(e.target.value)} />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>Cancelar</Button>
          <Button onClick={onSubmit} variant="outlined" color="primary" disabled={loading}>Adicionar</Button>
        </Box>
      </Box>
    </Modal>
)};
