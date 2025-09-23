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
    <Box className="login-view" sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3 }}>
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
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              onClick={handleLogin}
            >
              Ingresar
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
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
