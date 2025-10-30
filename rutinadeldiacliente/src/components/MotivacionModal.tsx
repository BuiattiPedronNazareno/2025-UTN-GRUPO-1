import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface MotivacionModalProps {
  open: boolean;
  onClose: () => void;
  subioNivel?: boolean;
  nuevoNivel?: string;
  mensaje?: string;
}

const MotivacionModal: React.FC<MotivacionModalProps> = ({
  open,
  onClose,
  subioNivel,
  nuevoNivel,
  mensaje = "¡COMPLETASTE LA RUTINA!",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="motivacion-modal-title"
      aria-describedby="motivacion-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      {/* Cerrar modal al hacer click sobre el Box */}
      <Box
        onClick={onClose} 
        sx={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          backgroundColor: "#76B875",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          p: 3,
          cursor: "pointer", 
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, textTransform: "uppercase" }}>
          {mensaje}
        </Typography>

        {subioNivel && nuevoNivel ? (
          <Typography variant="body1" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
             ¡SUBISTE AL NIVEL <b>{nuevoNivel}</b>!
          </Typography>
        ) : (
          <Typography variant="body1">¡FELICITACIONES!</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default MotivacionModal;
