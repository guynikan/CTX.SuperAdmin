import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { SegmentType, SegmentValue } from "@/types/segments";

type EditButtonProps = {
  segment: SegmentType | SegmentValue | undefined; 
  onEdit: (segment: SegmentType | SegmentValue | undefined) => void; 
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
