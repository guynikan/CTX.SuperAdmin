import { Modal, Box, Typography} from "@mui/material";

import { useDictionary } from "@/i18n/DictionaryProvider";
import ConfigurationTypeForm from "./ConfigurationTypeForm";
import { ConfigurationType } from "@/types/configuration";

type Props = {
  configuration: ConfigurationType
  open: boolean;
  onClose: () => void;
};

export default function EditModal({ open, onClose, configuration }: Props) {

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
          p: 3.5,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          { dictionary?.configuration?.modal.titleEdit}
        </Typography>

        <ConfigurationTypeForm initialValues={configuration} onClose={onClose}   />

      </Box>
    </Modal>
  );
}
