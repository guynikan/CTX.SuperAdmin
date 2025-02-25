import { Modal, Box, Typography} from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";
import SegmentValueForm from "./SegmentValueForm";
import { SegmentValue } from "@/types/segments";

type Props = {
  open: boolean;
  segment: SegmentValue; 
  onClose: () => void;
};

export default function EditModal({ open, onClose, segment }: Props) {

  const { dictionary  } = useDictionary();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderTop: "5px solid #333",
          boxShadow: 20,
          p: 5,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          { dictionary?.values.modal.titleEdit}
        </Typography>

        <SegmentValueForm onClose={onClose} initialValues={segment}  />

      </Box>
    </Modal>
  );
}