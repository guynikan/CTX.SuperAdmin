import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { SegmentType } from "@/types/segments";

type EditButtonProps = {
  segment: SegmentType; 
  onEdit: (segment: SegmentType) => void; 
};

const EditButton = ({ segment, onEdit }: EditButtonProps) => {
  return (
    <IconButton
      color="primary"
      size="small"
      aria-label="edit"
      data-testid="edit-button"
      onClick={() => onEdit(segment)}
    >
      <Edit />
    </IconButton>
  );
};

export default EditButton;
