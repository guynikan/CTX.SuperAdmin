import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

type EditButtonProps<T> = {
  item?: T;
  onEdit: (item: T | undefined) => void;
};

const EditButton = <T,>({ item, onEdit }: EditButtonProps<T>) => {
  return (
    <IconButton
      color="primary"
      size="small"
      aria-label="edit"
      data-testid="edit-button"
      onClick={() => onEdit(item)}
    >
      <Edit />
    </IconButton>
  );
};

export default EditButton;
