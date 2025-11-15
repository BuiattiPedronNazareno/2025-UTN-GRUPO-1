"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, Stack } from "@mui/material"
import NavBarAdulto from "../components/NavBarAdulto"
import "../styles/views/AjustesAdulto.scss"
import TutorialWizard from "../components/TutorialWizard"
import LinkTelegramSection from "../components/Settings/LinkTelegramSection"
import { useAppContext } from "../context/AppContext"

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
    console.log("Cargando perfil...")
  }

  const handleBackClick = () => {
    navigate("/adulto")
  }

  const { setUsuarioActivo, setInfanteActivo, setTipoUsuario } = useAppContext()

  const handleLogout = () => {
    // Limpiar contexto y localStorage (AppContext se encarga de persistencia)
    setUsuarioActivo(null)
    setInfanteActivo(null)
    setTipoUsuario(null)
    // Volver a login
    navigate("/login", { replace: true })
  }

  return (
    <Box className="ajustes-adulto">
      <NavBarAdulto title="Ajustes" showBackButton={true} />

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

          <Box className="vincular-telegram-section" sx={{ mt: 0, pt: 0, borderTop: "1px solid #ccc" }}>
            <LinkTelegramSection />
          </Box>

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

        {/* Sección separada para cerrar sesión */}
        <Box className="logout-section" sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            className="logout-button"
            onClick={handleLogout}
            sx={{ backgroundColor: "#D32F2F", color: "white", py: 1.8, px: 4, fontSize: "1rem", '&:hover': { backgroundColor: '#B71C1C' } }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default AjustesAdulto
