"use client"

import React from "react"
import { Modal, Box, Typography } from "@mui/material"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="help-modal-title"
      aria-describedby="help-modal-description"
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
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: "#3E8596", 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "black",
          p: 3,
        }}
      >
        <VolunteerActivismIcon sx={{ fontSize: 60, mb: 2 }} />

        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          LA AYUDA ESTÁ EN CAMINO
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          MANTÉN LA CALMA
        </Typography>
      </Box>
    </Modal>
  )
}

export default HelpModal
