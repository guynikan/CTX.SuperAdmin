import { Modal, Box, Typography} from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";
import SegmentValueForm from "./SegmentValueForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: Props) {

  const { dictionary: translations } = useDictionary();
  const dictionary = translations.segments;
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
          { dictionary?.values.modal.titleCreate}
        </Typography>

        <SegmentValueForm onClose={onClose}   />

      </Box>
    </Modal>
  );
}
