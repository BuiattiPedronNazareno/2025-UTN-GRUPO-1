"use client"

import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Container, Card, CardContent, TextField, Button, Typography } from "@mui/material"
import { validarPinAdulto } from "../services/adultoService"

const ValidarPinAdulto: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const usuarioId = (location.state as { usuarioId: number })?.usuarioId

  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleValidarPin = async () => {
    if (!pin) {
      setError("Ingrese un PIN")
      return
    }

    try {
      await validarPinAdulto(usuarioId, Number(pin))
      navigate("/adulto")
    } catch (err: any) {
      setError(err.response?.data || "PIN incorrecto")
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#BFDBD8", fontFamily: '"Comic Sans MS", cursive, sans-serif'}}>
      <Container maxWidth="sm">
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#E7F3F2", alignSelf: 'center'  }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
              Validar PIN de adulto
            </Typography>

            <TextField
              label="Ingrese PIN"
              type="password"
              fullWidth
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1, "& fieldset": { border: "none" } }}
            />

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, py: 1.5, borderRadius: 2, backgroundColor: "#87C2D4", color: "black", fontSize: "1rem" }}
              onClick={handleValidarPin}
            >
              Validar
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, color: "black" }}
              onClick={() => navigate(-1)}
            >
              Volver
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default ValidarPinAdulto
