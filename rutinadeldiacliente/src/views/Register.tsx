"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, Typography, TextField, Button, Box } from "@mui/material"
import { registrarUsuario } from "../services/UsuarioService"

const Register: React.FC = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [clave, setClave] = useState("")
  const [telefono, setTelefono] = useState("")
  const [pin, setPin] = useState("")

  const handleRegister = async () => {
  try {
    const data = { email, clave, telefono, pin: Number(pin) }
    await registrarUsuario(data)
    alert("Usuario registrado correctamente")
    navigate("/login")
  } catch (error: any) {
    alert(error.response?.data || "Error al registrar usuario")
  }
}
  return (
    <Box className="register-view" sx={{ minHeight: "100vh", backgroundColor: "#BFDBD8", py: 6, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3, backgroundColor: "#E7F3F2" }}>
          <CardContent>
            <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: "center" }}>
              Registro
            </Typography>

            <TextField
              label="Email"
              fullWidth
              margin="dense" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, "& fieldset": { border: "none" } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, "& fieldset": { border: "none" } }}
            />
            <TextField
              label="Teléfono"
              fullWidth
              margin="normal"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, "& fieldset": { border: "none" } }}
            />
            <TextField
              label="PIN de adulto"
              type="number"
              fullWidth
              margin="normal"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, "& fieldset": { border: "none" } }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5, borderRadius: 2, backgroundColor: "#87C2D4", color: "black", fontSize: "1rem" }}
              onClick={handleRegister}
            >
              Registrarse
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, color: "black" }}
              onClick={() => navigate("/login")}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Register
