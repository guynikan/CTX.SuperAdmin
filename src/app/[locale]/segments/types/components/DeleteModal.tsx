

import { useDeleteSegmentType } from "@/hooks/segments/useSegmentTypes";
import { SegmentType } from "@/types/segments";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  segment: SegmentType | null
};

export default function DeleteModal({ open, onClose, segment }: Props) {

  const deleteSegmentType = useDeleteSegmentType();
  const [loading, setLoading] = useState(false);

  const confirmDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSegmentType.mutateAsync(id);
      onClose();

    } catch (error) {
      console.error("Erro ao deletar Segment Type", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          borderTop:'5px solid #333',
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
        <Box>
          <Typography sx={{ fontSize: '16px', textAlign:'center'}} mb={2}> Deseja remover o Tipo de Segmento: <strong>{segment?.name}</strong> ?</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button 
          sx={{ marginRight:2 }}
            variant="contained" 
            color="error" 
            size="small"
            onClick={() => confirmDelete(segment?.id)}
            disabled={loading}>
              {loading ? "Removendo..." : "Remover"}

          </Button>  
          <Button 
            onClick={() => onClose()} 
            variant="outlined" 
            color="primary" 
            size="small">
              Cancelar
          </Button>
        </Box>
      
      
      </Box>
    </Modal>
  );
}
