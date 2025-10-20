"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, Typography, TextField, Button, Box } from "@mui/material"
import { loginUsuario } from "../services/UsuarioService"
import type { UsuarioLoginDTO } from "../services/UsuarioService"

const Login: React.FC = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [clave, setClave] = useState("")

  const handleLogin = async () => {
  try {
    const loginData: UsuarioLoginDTO = { email, clave }
    const usuario = await loginUsuario(loginData)
    
    alert("Bienvenido " + usuario.email)

    // Redirigir según corresponda, por ejemplo al inicio del infante
    navigate("/seleccionperfil", { state: { usuarioId: usuario.id } })
  } catch (error: any) {
    alert(error.response?.data || "Usuario o contraseña incorrecta")
  }
}


  return (
    <Box className="login-view" sx={{ minHeight: "100vh", backgroundColor: "#BFDBD8", py: 6, fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3, backgroundColor: "#E7F3F2" }}>
          <CardContent>
            <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: "center" }}>
              Iniciar Sesión
            </Typography>

            <TextField
              label="Email"
              fullWidth
              margin="normal"
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

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5, borderRadius: 2, backgroundColor: "#87C2D4", color: "black", fontSize: "1rem" }}
              onClick={handleLogin}
            >
              Ingresar
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, color: "black" }}
              onClick={() => navigate("/register")}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login
