import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { SegmentType, SegmentValue } from "@/types/segments";

type DeleteButtonProps = {
  segment: SegmentType; 
  onDelete: (segment: SegmentType | SegmentValue) => void;
};

const DeleteButton = ({ segment, onDelete }: DeleteButtonProps) => {
  return (
    <IconButton
      color="error"
      size="small"
      aria-label="delete"
      data-testid="delete-button"
      onClick={() => onDelete(segment)} 
    >
      <Delete />
    </IconButton>
  );
};

export default DeleteButton;
