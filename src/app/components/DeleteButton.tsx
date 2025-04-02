import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

type DeleteButtonProps = {
  onDelete: () => void;
};

const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
  return (
    <IconButton
      color="error"
      size="small"
      aria-label="delete"
      data-testid="delete-button"
      onClick={() => onDelete()} 
    >
      <Delete />
    </IconButton>
  );
};

export default DeleteButton;
