"use client"

import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Stack } from "@mui/material"
import NavBar from "../components/NavBar"
import "../styles/views/AjustesAdulto.scss"
import TutorialWizard from "../components/TutorialWizard"

const AjustesAdulto: React.FC = () => {
  const navigate = useNavigate()
   const [tutorialOpen, setTutorialOpen] = useState(false)

  const handleTutorialClick = () => {
    setTutorialOpen(true)
  }

  const handleCambiarPerfilClick = () => {
    navigate("/seleccionperfil") 
  }

  const handlePerfilClick = () => {
    navigate("/perfil-adulto")
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
            onClick={handleTutorialClick}
            sx={{ py: 3, fontSize: "1.2rem" }}
          >
            Tutorial Adulto
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
            className="ajuste-button perfil-button"
            onClick={handlePerfilClick}
            sx={{ backgroundColor: "#8FBC8F", py: 3, fontSize: "1.2rem" }}
          >
            Mi Perfil
          </Button>
        </Stack>

        <TutorialWizard open={tutorialOpen} onClose={() => setTutorialOpen(false)} mode="adulto" />

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
