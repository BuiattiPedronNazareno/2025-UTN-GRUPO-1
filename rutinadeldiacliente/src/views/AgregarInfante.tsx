"use client"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { agregarInfante } from "../services/infanteService"
import type { InfanteCreateDTO } from "../services/infanteService"
import type { InfanteNivelGetDTO } from "../services/infanteNivelService"
import { obtenerInfanteNiveles } from "../services/infanteNivelService"
import { obtenerCategorias } from "../services/categoriaService"
import type { CategoriaReadDTO } from "../services/categoriaService"

const AgregarInfante: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const usuarioId = location.state.usuarioId // viene del login

  const [nombre, setNombre] = useState("")
  const [infanteNivelId, setInfanteNivelId] = useState<number | "">("")
  const [niveles, setNiveles] = useState<InfanteNivelGetDTO[]>([])
  const [categorias, setCategorias] = useState<CategoriaReadDTO[]>([])
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([])

  // Cargar niveles y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nivelesData, categoriasData] = await Promise.all([
          obtenerInfanteNiveles(),
          obtenerCategorias(),
        ])
        setNiveles(nivelesData)
        setCategorias(categoriasData)
      } catch (error) {
        console.error("Error cargando datos:", error)
      }
    }
    fetchData()
  }, [])

  const handleGuardar = async () => {
    if (!nombre || !infanteNivelId) {
      alert("Por favor completa el nombre y el nivel del infante")
      return
    }

    const nuevoInfante: InfanteCreateDTO = {
      nombre,
      usuarioId,
      infanteNivelId: Number(infanteNivelId),
      categoriaIds: categoriasSeleccionadas,
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

            {/* Nombre */}
            <TextField
              label="Nombre del infante"
              fullWidth
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* Nivel */}
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

            {/* Categorías con icono de información */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <TextField
                select
                label="Categorías (opcional)"
                fullWidth
                margin="none"
                SelectProps={{
                  multiple: true,
                  value: categoriasSeleccionadas,
                  onChange: (e) => {
                    const value = e.target.value;
                    if (typeof value === "string") {
                      setCategoriasSeleccionadas(value.split(",").map((v) => Number(v)));
                    } else {
                      setCategoriasSeleccionadas(value as number[]);
                    }
                  },
                  renderValue: (selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as number[]).length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Ninguna seleccionada
                        </Typography>
                      ) : (
                        (selected as number[]).map((id) => {
                          const cat = categorias.find((c) => c.id === id)
                          return <Chip key={id} label={cat ? cat.descripcion : id} />
                        })
                      )}
                    </Box>
                  ),
                }}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.descripcion}
                  </MenuItem>
                ))}
              </TextField>
              <Tooltip 
                title="Si seleccionas categorías, se crearán rutinas precargadas para el infante."
                arrow
                placement="right"
              >
                <IconButton size="small" sx={{ mt: 0.5 }}>
                  <InfoOutlinedIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Botones */}
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