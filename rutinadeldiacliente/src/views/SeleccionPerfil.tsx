"use client"

import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Box, Container, Card, CardContent, Typography, Avatar } from "@mui/material"
import { useAppContext } from "../context/AppContext"
import { obtenerUsuarioPorId } from "../services/UsuarioService"
import type { UsuarioGetDTO, InfanteGetDTO } from "../services/UsuarioService"
import defaultInfante from "../assets/default-infante.png"
import defaultAdulto from "../assets/default-adulto.png"

const SeleccionPerfil: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuarioActivo, setUsuarioActivo, setInfanteActivo } = useAppContext()
  const [usuario, setUsuario] = useState<UsuarioGetDTO | null>(usuarioActivo || null)

  // Obtener usuarioId de location.state como fallback
  const usuarioIdFromState = (location.state as { usuarioId?: number })?.usuarioId

  useEffect(() => {
    const fetchUsuario = async () => {
      const id = usuarioActivo?.id || usuarioIdFromState
      if (!id) return

      try {
        const data = await obtenerUsuarioPorId(id)
        setUsuario(data)
        setUsuarioActivo(data)
      } catch (error) {
        console.error("Error al obtener usuario:", error)
      }
    }

    fetchUsuario()
  }, [usuarioActivo, usuarioIdFromState, setUsuarioActivo])

  const handleSeleccionPerfil = (perfil: "adulto" | InfanteGetDTO) => {
    if (perfil === "adulto") {
      setInfanteActivo(null) // Limpiar infante activo
      navigate("/validar-pin-adulto", { state: { usuarioId: usuario?.id } })
    } else {
      setInfanteActivo(perfil)
      navigate("/inicio")
    }
  }

  const handleAgregarInfante = () => {
    if (!usuario) return
    navigate("/agregar-infante", { state: { usuarioId: usuario.id } })
  }

  if (!usuario) return <Typography>Cargando perfiles...</Typography>

  return (
    <Box className="seleccion-perfil" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        ¿Quién va a usar la app?
      </Typography>

      <Container maxWidth="md">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {/* Infantes */}
          {usuario.infantes.map((infante) => (
            <Card
              key={infante.id}
              onClick={() => handleSeleccionPerfil(infante)}
              sx={{
                width: 200,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.05)" },
                borderRadius: 3,
                backgroundColor: "#3E8596"
              }}
            >
              <Avatar 
                src={defaultInfante}
                sx={{ width: 80, height: 80, mb: 2 }} 
              />
              <CardContent>
                <Typography variant="h6">{infante.nombre}</Typography>
              </CardContent>
            </Card>
          ))}

          {/* Adulto */}
          {usuario?.pinAdulto > 0 && (
            <Card
              onClick={() => handleSeleccionPerfil("adulto")}
              sx={{
                width: 200,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.05)" },
                borderRadius: 3,
                backgroundColor: "#7FB069"
              }}
            >
              <Avatar 
                src={defaultAdulto} 
                sx={{ width: 80, height: 80, mb: 2 }} 
              />
              <CardContent>
                <Typography variant="h6">Adulto</Typography>
              </CardContent>
            </Card>
          )}

          {/* Agregar infante */}
          <Card
            onClick={handleAgregarInfante}
            sx={{
              width: 200,
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.05)" },
              borderRadius: 3,
              backgroundColor: "#F5A623"
            }}
          >
            <Avatar sx={{ width: 80, height: 80, mb: 2 }}>+</Avatar>
            <CardContent>
              <Typography variant="h6">Agregar Infante</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default SeleccionPerfil
