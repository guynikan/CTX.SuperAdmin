

import { useDeleteSegmentType } from "@/hooks/segments/useSegmentTypes";
import { useDeleteSegmentValue } from "@/hooks/segments/useSegmentValues";
import { SegmentType, SegmentValue } from "@/types/segments";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  type: ""
  segment: SegmentType | SegmentValue
};

export default function DeleteModal({ open, onClose, segment }: Props) {

  const deleteSegmentType = useDeleteSegmentType();
  const deleteSegmentValue = useDeleteSegmentValue();

  const [loading, setLoading] = useState(false);

  const isSegmentValue = typeof segment === "object" && segment !== null && "segmentTypeId" in segment;


  const confirmDelete = async (id: string) => {
    if (!segment || typeof segment !== "object") return;
  
    setLoading(true);
    
    const mutation = isSegmentValue ? deleteSegmentValue : deleteSegmentType;
    try {
      await mutation.mutateAsync(id);
      onClose(); 
    } catch (error) {
      console.error("Erro ao deletar segmento:", error);
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
        <Typography data-testid="remove-title" sx={{ fontSize: "16px", textAlign: "center" }} mb={2}>
          Deseja remover
            { isSegmentValue ?  " O Valor do Segmento" :  " O Tipo de Segmento" }:{" "}
          <strong>{segment ? (isSegmentValue ? segment.displayName : segment.name ) : "?"}</strong>?
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          {segment &&   
            <Button 
            sx={{ marginRight:2 }}
            variant="contained" 
            color="error" 
            size="small"
            onClick={() => confirmDelete(segment.id)}
            disabled={loading}>
            {loading ? "Removendo..." : "Remover"}
          </Button>  }
         
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
