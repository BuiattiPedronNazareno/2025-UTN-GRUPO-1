"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Stack } from "@mui/material"
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/AjustesAdulto.scss"

const AjustesAdulto: React.FC = () => {
  const navigate = useNavigate()

  const handleNinoClick = () => {
    navigate("/")
  }

  const handlePerfilClick = () => {
    navigate("/perfil-adulto")
  }

  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleBackClick = () => {
    navigate("/adulto")
  }

  return (
    <Box className="ajustes-adulto">
      <NavBar title="Ajustes" showBackButton={true} onBackClick={handleBackClick} />

      <Container component="main" className="main-content" maxWidth="sm">
        <Stack spacing={3} className="ajustes-options">
          <Button
            variant="contained"
            size="large"
            className="ajuste-button nino-button"
            onClick={handleNinoClick}
            sx={{ backgroundColor: "#8FBC8F", py: 3, fontSize: "1.2rem" }}
          >
            Vista Niño
          </Button>

          <Button
            variant="contained"
            size="large"
            className="ajuste-button perfil-button"
            onClick={handlePerfilClick}
            sx={{ backgroundColor: "#8FBC8F", py: 3, fontSize: "1.2rem" }}
          >
            Mi Perfil
          </Button>
        </Stack>

        <Box className="help-section" sx={{ textAlign: "center", mt: 4 }}>
          <HelpButton onClick={handleHelpClick} />
        </Box>

        <Box className="back-section" sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="outlined"
            className="back-button"
            onClick={handleBackClick}
            sx={{ backgroundColor: "#CD5C5C", color: "white", "&:hover": { backgroundColor: "#B22222" } }}
          >
            Volver
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default AjustesAdulto
