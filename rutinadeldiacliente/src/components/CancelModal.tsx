import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="cancel-modal-title"
      aria-describedby="cancel-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <Box
        sx={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          backgroundColor: "#E5A000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "black",
          p: 3,
        }}
      >
        <PsychologyAltIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          RUTINA CANCELADA
        </Typography>
        <Typography variant="body1">
          NO TE PREOCUPES, SIEMPRE PODÉS VOLVER A EMPEZAR!
        </Typography>
      </Box>
    </Modal>
  );
};

export default CancelModal;
