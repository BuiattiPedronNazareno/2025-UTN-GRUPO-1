"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Stack } from "@mui/material"
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/AjustesInfante.scss"
import TutorialWizard from "../components/TutorialWizard"

const AjustesInfante: React.FC = () => {
  const navigate = useNavigate()
  const [tutorialOpen, setTutorialOpen] = useState(false)

  const handleTutorialClick = () => {
    setTutorialOpen(true)
  }
  const handleCambiarPerfilClick = () => {
    navigate("/seleccionperfil")
  }

  const handleLogrosClick = () => {
    navigate("/logros")
  }

  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleBackClick = () => {
    navigate("/") 
  }

  return (
    <Box className="ajustes-infante">
      <NavBar title="Ajustes" showBackButton={true} onBackClick={handleBackClick} alignLevel="right" />

      <Container component="main" className="main-content" maxWidth="sm">
        <Stack spacing={3} className="ajustes-options">
          
          <Button
            variant="contained"
            size="large"
            className="ajuste-button adulto-button"
            onClick={handleTutorialClick}
            sx={{ py: 3, fontSize: "1.2rem" }}
          >
            Tutorial Niño
          </Button>
          
          <Button
            variant="contained"
            size="large"
            className="ajuste-button cambiar-perfil-button"
            onClick={handleCambiarPerfilClick}
            sx={{ backgroundColor: "#8FBC8F", py: 3, fontSize: "1.2rem" }}
          >
            Cambiar de Perfil
          </Button>

          <Button
            variant="contained"
            size="large"
            className="ajuste-button logros-button"
            onClick={handleLogrosClick}
            sx={{ backgroundColor: "#8FBC8F", py: 3, fontSize: "1.2rem" }}
          >
            Mis logros
          </Button>
        </Stack>

        <TutorialWizard open={tutorialOpen} onClose={() => setTutorialOpen(false)} mode="infante" />

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

export default AjustesInfante
