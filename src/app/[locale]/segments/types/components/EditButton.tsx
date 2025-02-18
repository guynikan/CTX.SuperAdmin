import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { SegmentType } from "@/types/segments";

type EditButtonProps = {
  segment: SegmentType; // Passamos o objeto inteiro para poder preencher o modal
  onEdit: (segment: SegmentType) => void; // Função para abrir o modal
};

const EditButton = ({ segment, onEdit }: EditButtonProps) => {
  return (
    <IconButton
      color="primary"
      size="small"
      aria-label="edit"
      data-testid="edit-button"
      onClick={() => onEdit(segment)} // Abre o modal com os dados do segmento
    >
      <Edit />
    </IconButton>
  );
};

export default EditButton;
