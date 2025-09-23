"use client"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Container, Card, CardContent, Typography, TextField, Button, Box, MenuItem } from "@mui/material"
import { agregarInfante } from "../services/infanteService"
import type {InfanteCreateDTO} from "../services/infanteService"
import type { InfanteNivelGetDTO } from "../services/infanteNivelService"
import { obtenerInfanteNiveles } from "../services/infanteNivelService"


const AgregarInfante: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const usuarioId = location.state.usuarioId // viene del login

  const [nombre, setNombre] = useState("")
  const [infanteNivelId, setInfanteNivelId] = useState<number | "">("")
  const [niveles, setNiveles] = useState<InfanteNivelGetDTO[]>([])

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const data = await obtenerInfanteNiveles()
        setNiveles(data)
      } catch (error) {
        console.error("Error cargando niveles:", error)
      }
    }
    fetchNiveles()
  }, [])

  const handleGuardar = async () => {
    if (!nombre || !infanteNivelId) {
      alert("Por favor completa todos los campos")
      return
    }

    const nuevoInfante: InfanteCreateDTO = {
      nombre,
      usuarioId,
      infanteNivelId: Number(infanteNivelId),
    }

    try {
      const response = await agregarInfante(nuevoInfante)
      alert(response.mensaje)
      navigate("/seleccionperfil", { state: { usuarioId } })
    } catch (error) {
      alert("Error al agregar infante")
      console.error(error)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: "center" }}>
              Agregar Infante
            </Typography>

            <TextField
              label="Nombre del infante"
              fullWidth
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <TextField
              select
              label="Nivel del infante"
              fullWidth
              margin="normal"
              value={infanteNivelId}
              onChange={(e) => setInfanteNivelId(Number(e.target.value))}
            >
              {niveles.map((nivel) => (
                <MenuItem key={nivel.id} value={nivel.id}>
                  {nivel.descripcion}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              onClick={handleGuardar}
            >
              Guardar
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate("/seleccionperfil", { state: { usuarioId } })}
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AgregarInfante
